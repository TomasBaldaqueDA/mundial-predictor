/**
 * Verify critical Supabase migrations are applied (049–052).
 * Usage: npm run verify:migrations
 */
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

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
  return 1
}

function fail(msg) {
  console.log(`  ✗ ${msg}`)
  return 1
}

async function main() {
  if (process.env.QA_TLS_INSECURE === "1") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    console.warn("⚠ QA_TLS_INSECURE=1 — TLS certificate verification disabled\n")
  }

  const root = process.cwd()
  const env = { ...loadEnvFile(path.join(root, ".env.local")), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  let ok = 0
  let bad = 0

  console.log("## Scoring function (050 — qualifier +1)")

  const { data: pts, error: ptsErr } = await admin.rpc("calc_prediction_points", {
    p_score1: 2,
    p_score2: 1,
    p_mvp: "Player A",
    p_qualifier: "Team A",
    pred_score1: 2,
    pred_score2: 1,
    pred_mvp: "Player A",
    pred_qualifier: "Team A",
  })

  if (ptsErr) {
    bad += fail(`calc_prediction_points RPC: ${ptsErr.message} — apply migrations 049–050`)
  } else if (pts === 6) {
    ok += pass("calc_prediction_points exact+MVP+combo+qualifier = 6")
  } else {
    bad += fail(`calc_prediction_points returned ${pts}, expected 6`)
  }

  console.log("\n## Ranking RPC (052)")
  const { error: rankErr } = await admin.rpc("get_match_points_by_user")
  if (rankErr?.code === "PGRST202") {
    bad += fail("get_match_points_by_user missing — apply migration 052")
  } else if (rankErr) {
    bad += fail(`get_match_points_by_user: ${rankErr.message}`)
  } else {
    ok += pass("get_match_points_by_user exists")
  }

  console.log("\n## Group points RPC (018)")
  const { error: groupErr } = await admin.rpc("get_all_group_points")
  if (groupErr) bad += fail(`get_all_group_points: ${groupErr.message}`)
  else ok += pass("get_all_group_points exists")

  console.log(`\n---\nPassed: ${ok} | Failed: ${bad}`)
  if (bad > 0) process.exit(1)
}

main().catch((e) => {
  console.error("Migration verify failed:", e.message)
  process.exit(1)
})
