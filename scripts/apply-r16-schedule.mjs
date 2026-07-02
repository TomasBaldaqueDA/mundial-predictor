/**
 * Apply R16 schedule (Portuguese kickoffs + teams). Usage:
 *   QA_TLS_INSECURE=1 node scripts/apply-r16-schedule.mjs
 */
import fs from "node:fs"
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

const env = { ...loadEnvFile(".env.local"), ...process.env }
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const schedule = [
  { id: 89, kickoff_time: "2026-07-04 21:00:00", team1: "Paraguay", team2: "France" },
  { id: 90, kickoff_time: "2026-07-04 17:00:00", team1: "Canada", team2: "Morocco" },
  { id: 91, kickoff_time: "2026-07-05 20:00:00", team1: "Brazil", team2: "Norway" },
  { id: 92, kickoff_time: "2026-07-06 00:00:00", team1: "Mexico", team2: "England" },
  { id: 93, kickoff_time: "2026-07-06 19:00:00", team1: "W83", team2: "W84" },
  { id: 94, kickoff_time: "2026-07-07 00:00:00", team1: "USA", team2: "Belgium" },
  { id: 95, kickoff_time: "2026-07-07 16:00:00", team1: "W86", team2: "W88" },
  { id: 96, kickoff_time: "2026-07-07 20:00:00", team1: "W85", team2: "W87" },
]

for (const row of schedule) {
  const { id, ...patch } = row
  const { error } = await supabase.from("matches").update(patch).eq("id", id).eq("stage", "Round of 16")
  if (error) throw error
  console.log(`Match ${id}:`, patch)
}

const { data, error } = await supabase
  .from("matches")
  .select("id,team1,team2,kickoff_time")
  .gte("id", 89)
  .lte("id", 96)
  .order("kickoff_time")

if (error) throw error
console.log("\nR16 by kickoff:")
for (const m of data ?? []) {
  const t = String(m.kickoff_time).replace("T", " ").slice(0, 16)
  console.log(`${t}  ${m.team1} vs ${m.team2}  (id ${m.id})`)
}
