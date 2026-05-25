/**
 * Print SQL to upsert a nation squad (name + position only, no photos).
 * Usage: node scripts/upsert-squad-sql.mjs Spain gk:"Unai Simón,David Raya" df:"..." md:"..." st:"..."
 * Or pipe from a JSON file — see README.
 */
const team = process.argv[2]
if (!team) {
  console.error("Usage: node scripts/upsert-squad-sql.mjs <TeamName> gk:\"p1,p2\" df:\"...\" md:\"...\" st:\"...\"")
  process.exit(1)
}

function sqlEscape(s) {
  return s.replace(/'/g, "''")
}

function parseGroup(arg, label) {
  const prefix = `${label}:`
  const raw = process.argv.find((a) => a.startsWith(prefix))
  if (!raw) return []
  return raw
    .slice(prefix.length)
    .replace(/^"|"$/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

const groups = { gk: parseGroup("gk"), df: parseGroup("df"), md: parseGroup("md"), st: parseGroup("st") }
const total = Object.values(groups).reduce((n, arr) => n + arr.length, 0)

console.log(`-- ${team} squad (${total} players)`)
console.log(`DELETE FROM public.five_a_side_players WHERE team = '${sqlEscape(team)}';`)
console.log("")

const rows = []
for (const [pos, names] of Object.entries(groups)) {
  for (const name of names) {
    rows.push(`  ('${sqlEscape(name)}', '${sqlEscape(team)}', '${pos}')`)
  }
}
if (rows.length) {
  console.log(`INSERT INTO public.five_a_side_players (name, team, position) VALUES\n${rows.join(",\n")};`)
}
console.log("\nSELECT public.refresh_five_a_side_player_stats();")
