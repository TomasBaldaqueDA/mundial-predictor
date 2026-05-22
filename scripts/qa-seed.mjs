import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const TEST_USERS = [
  { email: "wc26.qa.01@example.com", password: "Wc26Qa!123", displayName: "QA User 01" },
  { email: "wc26.qa.02@example.com", password: "Wc26Qa!123", displayName: "QA User 02" },
  { email: "wc26.qa.03@example.com", password: "Wc26Qa!123", displayName: "QA User 03" },
]

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const raw = fs.readFileSync(filePath, "utf8")
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

async function getOrCreateUser(admin, cfg) {
  let page = 1
  const perPage = 200
  let found = null
  while (!found) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw new Error(`listUsers failed: ${error.message}`)
    const users = data?.users ?? []
    found = users.find((u) => (u.email ?? "").toLowerCase() === cfg.email.toLowerCase()) ?? null
    if (users.length < perPage) break
    page += 1
  }
  if (found) return found

  const { data, error } = await admin.auth.admin.createUser({
    email: cfg.email,
    password: cfg.password,
    email_confirm: true,
    user_metadata: { display_name: cfg.displayName },
  })
  if (error || !data.user) throw new Error(`createUser failed for ${cfg.email}: ${error?.message ?? "unknown"}`)
  return data.user
}

function chooseMvpFromRoster(match, players) {
  const roster = players.filter((p) => p.team === match.team1 || p.team === match.team2)
  return roster.length ? roster[0].name : null
}

function buildFiveASide(players) {
  const used = new Set()
  const byPos = {
    gk: players.filter((p) => p.position === "gk"),
    df: players.filter((p) => p.position === "df"),
    md: players.filter((p) => p.position === "md"),
    st: players.filter((p) => p.position === "st"),
  }

  const pick = (arr) => {
    const item = arr.find((p) => !used.has(p.team))
    if (!item) return null
    used.add(item.team)
    return item
  }

  const gk = pick(byPos.gk)
  const df = pick(byPos.df)
  const md1 = pick(byPos.md)
  const md2 = pick(byPos.md)
  const st = pick(byPos.st)
  if (!gk || !df || !md1 || !md2 || !st) return null
  return {
    gk_player_id: gk.id,
    df_player_id: df.id,
    md1_player_id: md1.id,
    md2_player_id: md2.id,
    st_player_id: st.id,
  }
}

async function main() {
  const root = process.cwd()
  const envFromFile = loadEnvFile(path.join(root, ".env.local"))
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envFromFile.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || envFromFile.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRole) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env/.env.local.")
  }

  const admin = createClient(supabaseUrl, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } })

  const users = []
  for (const cfg of TEST_USERS) {
    const user = await getOrCreateUser(admin, cfg)
    users.push({
      id: user.id,
      email: cfg.email,
      displayName: cfg.displayName,
      password: cfg.password,
    })
  }

  await admin.from("profiles").upsert(
    users.map((u) => ({ id: u.id, display_name: u.displayName })),
    { onConflict: "id" }
  )

  const [{ data: matches }, { data: players }, { data: questions }, { data: groupTeams }] = await Promise.all([
    admin.from("matches").select("id, team1, team2, kickoff_time, stage").order("kickoff_time", { ascending: true }).limit(6),
    admin.from("five_a_side_players").select("id, name, team, position").order("team"),
    admin.from("special_questions").select("id, type").order("sort_order", { ascending: true }),
    admin.from("group_teams").select("group_code, team_name").order("group_code", { ascending: true }).order("team_name", { ascending: true }),
  ])

  const safeMatches = matches ?? []
  const safePlayers = players ?? []
  const safeQuestions = questions ?? []
  const safeGroupTeams = groupTeams ?? []

  let predictionsCount = 0
  const predictionErrors = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    for (let j = 0; j < Math.min(4, safeMatches.length); j++) {
      const m = safeMatches[j]
      const base = (i + j) % 3
      const pred1 = base
      const pred2 = (base + i) % 3
      const mvp = chooseMvpFromRoster(m, safePlayers)
      const payload = {
        user_id: user.id,
        user_name: user.displayName,
        match_id: m.id,
        pred_score1: pred1,
        pred_score2: pred2,
        pred_mvp: mvp ?? `${m.team1} Player`,
        pred_qualifier: pred1 === pred2 && m.stage !== "First Stage" ? m.team1 : null,
        points_multiplier: j === 0 ? 2 : 1,
      }
      const { data: existing, error: existingErr } = await admin
        .from("predictions")
        .select("id")
        .eq("user_id", user.id)
        .eq("match_id", m.id)
        .limit(1)
      if (existingErr) {
        predictionErrors.push(`select existing failed (user ${user.email}, match ${m.id}): ${existingErr.message}`)
        continue
      }
      if (existing && existing.length > 0) {
        const { error } = await admin.from("predictions").update(payload).eq("id", existing[0].id)
        if (error) {
          predictionErrors.push(`update failed (user ${user.email}, match ${m.id}): ${error.message}`)
        } else {
          predictionsCount += 1
        }
      } else {
        const { error } = await admin.from("predictions").insert(payload)
        if (error) {
          predictionErrors.push(`insert failed (user ${user.email}, match ${m.id}): ${error.message}`)
        } else {
          predictionsCount += 1
        }
      }
    }
  }

  let answersCount = 0
  for (const user of users) {
    for (let i = 0; i < safeQuestions.length; i++) {
      const q = safeQuestions[i]
      const answer =
        q.type === "number" ? String((i + 1) * 2) : `QA answer ${i + 1} by ${user.displayName}`
      const { error } = await admin
        .from("special_answers")
        .upsert({ user_id: user.id, question_id: q.id, answer }, { onConflict: "user_id,question_id" })
      if (!error) answersCount += 1
    }
  }

  let groupsCount = 0
  const teamsByGroup = new Map()
  for (const row of safeGroupTeams) {
    if (!teamsByGroup.has(row.group_code)) teamsByGroup.set(row.group_code, [])
    teamsByGroup.get(row.group_code).push(row.team_name)
  }
  const firstGroupCode = [...teamsByGroup.keys()][0]
  if (firstGroupCode) {
    const teams = (teamsByGroup.get(firstGroupCode) ?? []).slice(0, 4)
    for (const user of users) {
      for (let pos = 1; pos <= teams.length; pos++) {
        const teamName = teams[pos - 1]
        const { error } = await admin.from("group_predictions").upsert(
          { user_id: user.id, group_code: firstGroupCode, team_name: teamName, position: pos },
          { onConflict: "user_id,group_code,position" }
        )
        if (!error) groupsCount += 1
      }
    }
  }

  let fiveSideCount = 0
  const picks = buildFiveASide(safePlayers)
  if (picks) {
    for (const user of users) {
      const { error } = await admin.from("five_a_side_picks").upsert(
        {
          user_id: user.id,
          ...picks,
          submitted_at: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      if (!error) fiveSideCount += 1
    }
  }

  let leagueCode = null
  if (users[0]) {
    const { data: league, error } = await admin
      .from("private_leagues")
      .insert({ name: "QA League Auto", owner_id: users[0].id })
      .select("id, invite_code")
      .single()
    if (!error && league) {
      leagueCode = league.invite_code
      for (const u of users.slice(1)) {
        await admin
          .from("private_league_members")
          .upsert({ league_id: league.id, user_id: u.id }, { onConflict: "league_id,user_id" })
      }
    }
  }

  console.log("\nQA seed completed.")
  console.log(`Users ready: ${users.length}`)
  console.log(`Predictions upserted: ${predictionsCount}`)
  console.log(`Special answers upserted: ${answersCount}`)
  console.log(`Group predictions upserted: ${groupsCount}`)
  console.log(`Five-a-side rows upserted: ${fiveSideCount}`)
  if (leagueCode) console.log(`League invite code: ${leagueCode}`)
  if (predictionErrors.length) {
    console.log(`Prediction warnings: ${predictionErrors.length}`)
    for (const msg of predictionErrors.slice(0, 5)) {
      console.log(`  - ${msg}`)
    }
  }
  console.log("\nTest users:")
  for (const u of users) {
    console.log(`- ${u.email} | password: ${u.password} | name: ${u.displayName}`)
  }
}

main().catch((err) => {
  console.error("QA seed failed:", err.message)
  process.exit(1)
})
