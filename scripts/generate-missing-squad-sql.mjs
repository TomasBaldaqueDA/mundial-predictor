/**
 * Generate squad SQL migrations from scripts/squads-sky-june-2026.json
 * Usage: node scripts/generate-missing-squad-sql.mjs
 */
import fs from "node:fs"
import path from "node:path"

const REPO = path.resolve(import.meta.dirname, "..")
const DATA = JSON.parse(fs.readFileSync(path.join(REPO, "scripts", "squads-sky-june-2026.json"), "utf8"))
const OUT_DIR = path.join(REPO, "supabase", "sql")

const FILE_MAP = [
  [95, "mexico", "Mexico"],
  [96, "czechia", "Czechia"],
  [97, "canada", "Canada"],
  [98, "qatar", "Qatar"],
  [99, "paraguay", "Paraguay"],
  [100, "australia", "Australia"],
  [101, "turkiye", "Türkiye"],
  [102, "iran", "IR Iran"],
  [103, "saudi_arabia", "Saudi Arabia"],
  [104, "uruguay", "Uruguay"],
  [105, "algeria", "Algeria"],
  [106, "argentina", "Argentina"],
  [107, "iraq", "Iraq"],
  [108, "jordan", "Jordan"],
  [109, "uzbekistan", "Uzbekistan"],
]

function sqlEscape(s) {
  return s.replace(/'/g, "''")
}

function generate(team, squad) {
  const counts = {
    gk: squad.gk.length,
    df: squad.df.length,
    md: squad.md.length,
    st: squad.st.length,
  }
  const total = counts.gk + counts.df + counts.md + counts.st
  const lines = [
    `-- ${team} 2026 World Cup squad (${total}: ${counts.gk} GK, ${counts.df} DF, ${counts.md} MD, ${counts.st} ST). Sky Sports June 2026.`,
    "",
    `DELETE FROM public.five_a_side_players WHERE team = '${sqlEscape(team)}';`,
    "",
    "INSERT INTO public.five_a_side_players (name, team, position) VALUES",
  ]

  const rows = []
  for (const pos of ["gk", "df", "md", "st"]) {
    for (const name of squad[pos]) {
      rows.push(`  ('${sqlEscape(name)}', '${sqlEscape(team)}', '${pos}')`)
    }
  }
  lines.push(rows.join(",\n") + ";")
  lines.push("")
  lines.push("SELECT public.refresh_five_a_side_player_stats();")
  lines.push("")
  return lines.join("\n")
}

for (const [num, slug, team] of FILE_MAP) {
  const squad = DATA[team]
  if (!squad) {
    console.error(`Missing squad data for ${team}`)
    process.exit(1)
  }
  const file = path.join(OUT_DIR, `${String(num).padStart(3, "0")}_${slug}_squad.sql`)
  fs.writeFileSync(file, generate(team, squad), "utf8")
  console.log(`Wrote ${path.relative(REPO, file)} (${squad.gk.length + squad.df.length + squad.md.length + squad.st.length} players)`)
}
