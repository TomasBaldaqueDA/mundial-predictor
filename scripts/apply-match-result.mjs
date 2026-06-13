/**
 * Apply a finished match result via Supabase service role (no DDL).
 * Usage: QA_TLS_INSECURE=1 node scripts/apply-match-result.mjs scripts/match-results/004-usa-paraguay.json
 *
 * After this, run: node scripts/recalc-stats-from-appearances.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

if (process.env.QA_TLS_INSECURE === "1") process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

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

const matchFile = process.argv[2]
if (!matchFile) {
  console.error("Usage: node scripts/apply-match-result.mjs scripts/match-results/NNN-team-team.json")
  process.exit(1)
}

const MATCH = JSON.parse(fs.readFileSync(path.resolve(matchFile), "utf8"))

const env = { ...loadEnvFile(path.join(process.cwd(), ".env.local")), ...process.env }
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function bumpStat(team, name, field, count = 1) {
  const { data, error: fetchErr } = await supabase
    .from("five_a_side_players")
    .select("id, goals, assists")
    .eq("team", team)
    .eq("name", name)
    .maybeSingle()
  if (fetchErr) throw fetchErr
  if (!data) throw new Error(`Player not found: ${team} / ${name}`)
  const current = field === "goals" ? (data.goals ?? 0) : (data.assists ?? 0)
  const patch = field === "goals" ? { goals: current + count } : { assists: current + count }
  const { error } = await supabase.from("five_a_side_players").update(patch).eq("id", data.id)
  if (error) throw error
}

const { error: matchErr } = await supabase
  .from("matches")
  .update({ status: "finished", score1: MATCH.score1, score2: MATCH.score2, mvp: MATCH.mvp })
  .eq("id", MATCH.id)
if (matchErr) throw matchErr
console.log(`Match ${MATCH.id}: ${MATCH.score1}-${MATCH.score2}, MVP ${MATCH.mvp}`)

for (const g of MATCH.goals) await bumpStat(g.team, g.name, "goals", g.count ?? 1)
for (const a of MATCH.assists) await bumpStat(a.team, a.name, "assists")
console.log("Goals and assists updated")

const { data: match } = await supabase
  .from("matches")
  .select("team1, team2, score1, score2, status, mvp")
  .eq("id", MATCH.id)
  .single()
console.log("Verified:", match)
