/**
 * Pre-launch QA audit: multi-user auth, data isolation, DB guards, page smoke.
 *
 * Usage: npm run qa:audit
 * Requires .env.local (Supabase URL + service role + anon key for sign-in tests).
 *
 * Set QA_TLS_INSECURE=1 only on trusted networks if TLS cert verification fails locally.
 */
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const QA_USERS = [
  { email: "wc26.qa.01@example.com", password: "Wc26Qa!123" },
  { email: "wc26.qa.02@example.com", password: "Wc26Qa!123" },
  { email: "wc26.qa.03@example.com", password: "Wc26Qa!123" },
]

const SITE = process.env.QA_SITE_URL || "https://mundial-predictor.vercel.app"

if (process.env.QA_TLS_INSECURE === "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  console.warn("⚠ QA_TLS_INSECURE=1 — TLS certificate verification disabled\n")
}
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const out = {}
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    out[trimmed.slice(0, idx).trim()] = value
  }
  return out
}

function pass(msg) {
  console.log(`  ✓ ${msg}`)
  return true
}

function fail(msg) {
  console.log(`  ✗ ${msg}`)
  return 1
}

async function signIn(supabaseUrl, anonKey, email, password) {
  const client = createClient(supabaseUrl, anonKey)
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error || !data.session) throw new Error(`signIn ${email}: ${error?.message ?? "no session"}`)
  return client
}

async function main() {
  const root = process.cwd()
  const env = { ...loadEnvFile(path.join(root, ".env.local")), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  const cronSecret = env.CRON_SECRET

  if (!url || !anonKey || !serviceKey) {
    throw new Error("Missing Supabase env (URL, anon key, service role).")
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  let ok = 0
  let bad = 0
  const section = (title) => console.log(`\n## ${title}`)

  section("Smoke — public pages")
  const publicPaths = ["/", "/login", "/register", "/rules"]
  for (const p of publicPaths) {
    try {
      const res = await fetch(`${SITE}${p}`, { redirect: "follow" })
      if (res.status === 200) ok += pass(`${p} → ${res.status}`)
      else bad += fail(`${p} → ${res.status}`)
    } catch (e) {
      bad += fail(`${p} → ${e.message}`)
    }
  }

  section("Smoke — auth-gated pages redirect to login")
  const protectedPaths = ["/games", "/five-a-side", "/leagues", "/questions", "/ranking"]
  for (const p of protectedPaths) {
    try {
      const res = await fetch(`${SITE}${p}`, { redirect: "manual" })
      const location = res.headers.get("location") ?? ""
      if (res.status === 307 || res.status === 302) {
        if (location.includes("/login")) ok += pass(`${p} → ${res.status} login redirect`)
        else bad += fail(`${p} → ${res.status} unexpected redirect ${location}`)
      } else if (res.status === 200) {
        bad += fail(`${p} → 200 without auth (middleware may be misconfigured)`)
      } else {
        bad += fail(`${p} → ${res.status}`)
      }
    } catch (e) {
      bad += fail(`${p} → ${e.message}`)
    }
  }

  section("Data — core tables")
  const checks = [
    ["matches", admin.from("matches").select("id", { count: "exact", head: true })],
    ["five_a_side_players", admin.from("five_a_side_players").select("id", { count: "exact", head: true })],
    ["special_questions", admin.from("special_questions").select("id", { count: "exact", head: true })],
    ["group_teams", admin.from("group_teams").select("group_code", { count: "exact", head: true })],
  ]
  for (const [name, q] of checks) {
    const { count, error } = await q
    if (error) bad += fail(`${name}: ${error.message}`)
    else if ((count ?? 0) > 0) ok += pass(`${name}: ${count} rows`)
    else bad += fail(`${name}: empty`)
  }

  const { data: teamRows, error: teamErr } = await admin.rpc("count_distinct_five_a_side_teams").maybeSingle()
  let teamCount = 0
  if (teamErr?.code === "PGRST202") {
    const { data: allTeams } = await admin.from("five_a_side_players").select("team")
    teamCount = new Set((allTeams ?? []).map((r) => r.team)).size
  } else if (!teamErr && teamRows != null) {
    teamCount = Number(teamRows)
  } else {
    const { data: allTeams } = await admin.from("five_a_side_players").select("team")
    teamCount = new Set((allTeams ?? []).map((r) => r.team)).size
  }
  if (teamCount >= 35) ok += pass(`five_a_side teams: ${teamCount} (target 48 after full cartoon sync)`)
  else bad += fail(`five_a_side teams: only ${teamCount}`)

  section("Multi-user — sign-in & own data")
  const clients = []
  for (const u of QA_USERS) {
    try {
      const c = await signIn(url, anonKey, u.email, u.password)
      clients.push({ email: u.email, client: c })
      ok += pass(`login ${u.email}`)
    } catch (e) {
      bad += fail(e.message)
    }
  }

  if (clients.length >= 2) {
    const [a, b] = clients
    const { data: predsA } = await a.client.from("predictions").select("id, user_id").limit(3)
    const { data: predsB } = await b.client.from("predictions").select("id, user_id").limit(3)
    if (predsA?.length && predsB?.length) ok += pass("each user has predictions rows")
    else bad += fail("missing predictions for QA users (run npm run qa:seed)")

    const rowA = predsA?.[0]
    if (rowA) {
      const { data: tampered, error: tamper } = await b.client
        .from("predictions")
        .update({ pred_score1: 9 })
        .eq("id", rowA.id)
        .select("id")
      if (tamper || !tampered?.length) ok += pass("cannot update another user's prediction")
      else bad += fail("RLS allowed cross-user prediction update")
    }
  }

  section("League — QA league exists")
  const { data: leagues } = await admin
    .from("private_leagues")
    .select("id, invite_code, name")
    .ilike("name", "%QA League%")
    .limit(1)
  if (leagues?.length) ok += pass(`league "${leagues[0].name}" code ${leagues[0].invite_code}`)
  else bad += fail("no QA league (run npm run qa:seed)")

  section("Cron auth — Bearer header (local if QA_CRON_BASE + CRON_SECRET set)")
  if (cronSecret && process.env.QA_CRON_BASE) {
    const base = process.env.QA_CRON_BASE.replace(/\/$/, "")
    for (const ep of ["/api/cron/advance-matches", "/api/cron/live-scores?force=1"]) {
      const noAuth = await fetch(`${base}${ep}`)
      const withBearer = await fetch(`${base}${ep}`, {
        headers: { Authorization: `Bearer ${cronSecret}` },
      })
      if (noAuth.status === 401) ok += pass(`${ep} rejects without auth`)
      else bad += fail(`${ep} should 401 without auth (got ${noAuth.status})`)
      if (withBearer.status === 200 || withBearer.status === 503) ok += pass(`${ep} accepts Bearer (${withBearer.status})`)
      else bad += fail(`${ep} Bearer → ${withBearer.status}`)
    }
  } else {
    console.log("  (skip — set QA_CRON_BASE + CRON_SECRET to test cron locally)")
  }

  section("Migrations — scoring & ranking RPCs")
  const { data: pts, error: ptsErr } = await admin.rpc("calc_prediction_points", {
    p_score1: 2,
    p_score2: 1,
    p_mvp: "A",
    p_qualifier: "Team A",
    pred_score1: 2,
    pred_score2: 1,
    pred_mvp: "A",
    pred_qualifier: "Team A",
  })
  if (ptsErr) bad += fail(`calc_prediction_points: ${ptsErr.message} — apply 049–050`)
  else if (pts === 6) ok += pass("calc_prediction_points qualifier scoring = 6")
  else bad += fail(`calc_prediction_points returned ${pts}, expected 6`)

  const { error: rankRpcErr } = await admin.rpc("get_match_points_by_user")
  if (rankRpcErr?.code === "PGRST202") bad += fail("get_match_points_by_user missing — apply 052")
  else if (rankRpcErr) bad += fail(`get_match_points_by_user: ${rankRpcErr.message}`)
  else ok += pass("get_match_points_by_user RPC ready")

  section("DB guard — migration 048 (kickoff / points)")
  const { data: pastMatch } = await admin
    .from("matches")
    .select("id, kickoff_time")
    .lt("kickoff_time", new Date().toISOString())
    .limit(1)
    .maybeSingle()

  if (pastMatch && clients[0]) {
    const uid = (await clients[0].client.auth.getUser()).data.user?.id
    const { data: pred } = await admin
      .from("predictions")
      .select("id, pred_score1, pred_score2, points")
      .eq("user_id", uid)
      .eq("match_id", pastMatch.id)
      .maybeSingle()
    if (pred) {
      const { error: lockErr } = await clients[0].client
        .from("predictions")
        .update({ pred_score1: (pred.pred_score1 ?? 0) + 1 })
        .eq("id", pred.id)
      if (lockErr?.message?.includes("locked after kickoff")) ok += pass("post-kickoff edit blocked (048)")
      else if (lockErr) ok += pass(`post-kickoff edit blocked: ${lockErr.message}`)
      else bad += fail("post-kickoff edit allowed — apply supabase/sql/048")

      const { error: ptsErr } = await clients[0].client.from("predictions").update({ points: 999 }).eq("id", pred.id)
      const { data: after } = await admin.from("predictions").select("points").eq("id", pred.id).single()
      if (!ptsErr && after?.points === pred.points) ok += pass("client cannot change points column")
      else if (ptsErr) ok += pass("points update rejected")
      else bad += fail(`points tampering: was ${pred.points} now ${after?.points}`)
    } else {
      console.log("  (skip — no past-match prediction for QA user 01)")
    }
  } else {
    console.log("  (skip — no finished match yet)")
  }

  console.log(`\n---\nPassed checks: ${ok} | Failed: ${bad}`)
  if (bad > 0) process.exit(1)
}

main().catch((e) => {
  console.error("QA audit failed:", e.message)
  process.exit(1)
})
