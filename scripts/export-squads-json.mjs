import fs from "node:fs"
import path from "node:path"

const dir = path.join(import.meta.dirname, "..", "supabase", "sql")
const files = fs.readdirSync(dir).filter((f) => /_squad\.sql$/.test(f)).sort()
const squads = {}

for (const f of files) {
  const sql = fs.readFileSync(path.join(dir, f), "utf8")
  const tm = sql.match(/WHERE team = '((?:[^']|'')+)'/)
  if (!tm) continue
  const team = tm[1].replace(/''/g, "'")
  const re = /\('((?:[^']|'')*)',\s*'(?:[^']|'')*',\s*'([^']+)'([^)]*)\)/g
  const players = []
  let match
  while ((match = re.exec(sql))) {
    const tail = match[3]
    const numMatch = tail.match(/,\s*(\d+)\s*\)/) || tail.match(/,\s*(\d+)\s*,/)
    players.push({
      name: match[1].replace(/''/g, "'"),
      position: match[2],
      jersey_number: numMatch ? +numMatch[1] : null,
    })
  }
  if (players.length > 0) squads[team] = players
}

fs.writeFileSync(
  path.join(import.meta.dirname, "squads-export.json"),
  JSON.stringify(squads, null, 2),
  "utf8"
)
console.log(Object.keys(squads).length, "teams exported")
