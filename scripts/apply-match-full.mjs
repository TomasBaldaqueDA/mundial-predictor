/**
 * Apply a finished match result via Supabase service role (no raw SQL / DDL).
 * Usage:
 *   QA_TLS_INSECURE=1 node scripts/apply-match-full.mjs scripts/match-results/080-england-congo-dr.json
 *
 * Optional bracket slot (Round of 16):
 *   QA_TLS_INSECURE=1 node scripts/apply-match-full.mjs scripts/match-results/080-england-congo-dr.json --bracket 92:team2:England
 */
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { formatBracketArg } from "./knockout-bracket.mjs"

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
  console.error("Usage: node scripts/apply-match-full.mjs scripts/match-results/NNN-team-team.json [--bracket matchId:slot:team]")
  process.exit(1)
}

const MATCH = JSON.parse(fs.readFileSync(path.resolve(matchFile), "utf8"))
const eqBracket = process.argv.find((a) => a.startsWith("--bracket="))
const flagIdx = process.argv.indexOf("--bracket")
const bracketArg =
  eqBracket?.slice("--bracket=".length) ??
  (flagIdx >= 0 ? process.argv[flagIdx + 1] : null) ??
  MATCH.bracket ??
  (MATCH.qualifier ? formatBracketArg(MATCH.id, MATCH.qualifier) : null)

const APPEARANCES = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "match-appearances.json"), "utf8")
)
const appearanceEntry = APPEARANCES.find((m) => m.matchId === MATCH.id)
if (!appearanceEntry) throw new Error(`No appearances in data/match-appearances.json for match ${MATCH.id}`)

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

const patch = {
  status: "finished",
  score1: MATCH.score1,
  score2: MATCH.score2,
  mvp: MATCH.mvp,
}
if (MATCH.qualifier) patch.qualifier = MATCH.qualifier

const { error: matchErr } = await supabase.from("matches").update(patch).eq("id", MATCH.id)
if (matchErr) throw matchErr
console.log(`Match ${MATCH.id}: ${MATCH.score1}-${MATCH.score2}, MVP ${MATCH.mvp}${MATCH.qualifier ? `, qualifier ${MATCH.qualifier}` : ""}`)

for (const g of MATCH.goals ?? []) await bumpStat(g.team, g.name, "goals", g.count ?? 1)
for (const a of MATCH.assists ?? []) await bumpStat(a.team, a.name, "assists", a.count ?? 1)
console.log("Goals and assists updated")

for (const [team, names] of Object.entries(appearanceEntry.appearances)) {
  const { error } = await supabase.rpc("add_match_appearances", {
    p_match_id: MATCH.id,
    p_team: team,
    p_names: names,
  })
  if (error) throw error
  console.log(`Appearances: match ${MATCH.id} ${team} (${names.length} players)`)
}

if (bracketArg) {
  const [bracketMatchId, slot, team] = bracketArg.split(":")
  if (!bracketMatchId || !slot || !team) throw new Error(`Invalid --bracket: ${bracketArg}`)
  const { error } = await supabase
    .from("matches")
    .update({ [slot]: team })
    .eq("id", Number(bracketMatchId))
  if (error) throw error
  console.log(`Bracket: match ${bracketMatchId} ${slot} = ${team}`)
}

const { error: refreshErr } = await supabase.rpc("refresh_five_a_side_player_stats")
if (refreshErr) throw refreshErr
console.log("refresh_five_a_side_player_stats done")

const { data: match, error: verifyErr } = await supabase
  .from("matches")
  .select("id, team1, team2, score1, score2, mvp, qualifier, status")
  .eq("id", MATCH.id)
  .single()
if (verifyErr) throw verifyErr
console.log("Verified:", match)
