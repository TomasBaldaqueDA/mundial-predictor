/**
 * Recalculate wins / clean_sheets / mvp (and games_played if present) from appearance lists.
 * Usage: QA_TLS_INSECURE=1 node scripts/recalc-stats-from-appearances.mjs
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

const MATCH_APPEARANCES = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "match-appearances.json"), "utf8")
)

const env = { ...loadEnvFile(path.join(process.cwd(), ".env.local")), ...process.env }
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const players = []
for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase
    .from("five_a_side_players")
    .select("id, name, team, position")
    .order("team")
    .order("name")
    .range(from, from + 999)
  if (error) throw error
  if (!data?.length) break
  players.push(...data)
  if (data.length < 1000) break
}

const byTeamName = new Map(players.map((p) => [`${p.team}|${p.name}`, p]))

function findPlayer(team, name) {
  const p = byTeamName.get(`${team}|${name}`)
  if (!p) throw new Error(`Player not found: ${team} / ${name}`)
  return p
}

const stats = new Map(players.map((p) => [p.id, { games_played: 0, wins: 0, clean_sheets: 0, mvp: 0 }]))

for (const m of MATCH_APPEARANCES) {
  for (const [team, names] of Object.entries(m.appearances)) {
    const isTeam1 = team === m.team1
    const goalsFor = isTeam1 ? m.score1 : m.score2
    const goalsAgainst = isTeam1 ? m.score2 : m.score1
    const won = goalsFor > goalsAgainst
    const cleanSheet = goalsAgainst === 0

    for (const name of names) {
      const p = findPlayer(team, name)
      const s = stats.get(p.id)
      s.games_played += 1
      if (won) s.wins += 1
      if (cleanSheet && (p.position === "gk" || p.position === "df")) s.clean_sheets += 1
    }
  }
  const mvpPlayer = findPlayer(m.mvp.team, m.mvp.name)
  stats.get(mvpPlayer.id).mvp += 1
}

const hasGamesPlayed = !(await supabase.from("five_a_side_players").select("games_played").limit(1)).error

const resetPatch = { wins: 0, clean_sheets: 0, mvp: 0 }
if (hasGamesPlayed) resetPatch.games_played = 0

const { error: resetErr } = await supabase
  .from("five_a_side_players")
  .update(resetPatch)
  .not("id", "is", null)
if (resetErr) throw resetErr

const changed = [...stats.entries()].filter(([, s]) => s.games_played || s.wins || s.clean_sheets || s.mvp)
for (const [id, s] of changed) {
  const patch = { wins: s.wins, clean_sheets: s.clean_sheets, mvp: s.mvp }
  if (hasGamesPlayed) patch.games_played = s.games_played
  const { error } = await supabase.from("five_a_side_players").update(patch).eq("id", id)
  if (error) throw error
}

const { error: maProbeErr } = await supabase.from("match_appearances").select("id").limit(1)
if (!maProbeErr) {
  const rows = []
  for (const m of MATCH_APPEARANCES) {
    for (const [team, names] of Object.entries(m.appearances)) {
      for (const name of names) {
        rows.push({ match_id: m.matchId, player_id: findPlayer(team, name).id })
      }
    }
  }
  const { error: upsertErr } = await supabase
    .from("match_appearances")
    .upsert(rows, { onConflict: "match_id,player_id" })
  if (upsertErr) throw upsertErr
  await supabase.rpc("refresh_five_a_side_player_stats")
}

const sample = ["Son Heung-min", "Kim Moon-hwan", "Song Bum-keun", "Johan Vasquez", "Santiago Gimenez"]
const verifySelect = hasGamesPlayed
  ? "name, team, games_played, wins, clean_sheets, mvp"
  : "name, team, wins, clean_sheets, mvp"
const { data: verify } = await supabase
  .from("five_a_side_players")
  .select(verifySelect)
  .in("name", sample)
  .order("name")

console.log(`Recalculated ${changed.length} players with match stats (${players.length} total squad)`)
console.log("games_played column:", hasGamesPlayed ? "yes" : "no — apply supabase/sql/118_match_appearances.sql")
console.log("match_appearances table:", maProbeErr ? "no" : "synced")
console.table(verify)
