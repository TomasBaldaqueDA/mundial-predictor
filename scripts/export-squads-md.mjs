/**
 * Export all five_a_side_players to docs/SQUADS.md (source of truth: production DB).
 * Usage: npm run export:squads  (requires .env.local with Supabase keys)
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

const POS_LABEL = { gk: "Goalkeepers", df: "Defenders", md: "Midfielders", st: "Forwards" }
const POS_ORDER = ["gk", "df", "md", "st"]

function isPlaceholder(name) {
  return / (GK|DF|MD|ST) \d+$/i.test(name) || /^[A-Za-z ]+ (GK|DF|MD|ST) \d+$/i.test(name)
}

async function main() {
  const root = process.cwd()
  if (process.env.SQUADS_EXPORT_INSECURE_TLS === "1") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  }
  const env = { ...loadEnvFile(path.join(root, ".env.local")), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  const pageSize = 1000
  const data = []
  for (let from = 0; ; from += pageSize) {
    const { data: page, error } = await supabase
      .from("five_a_side_players")
      .select("name, team, position, jersey_number")
      .order("team")
      .order("position")
      .order("name")
      .range(from, from + pageSize - 1)
    if (error) throw error
    if (!page?.length) break
    data.push(...page)
    if (page.length < pageSize) break
  }

  const byTeam = new Map()
  for (const row of data ?? []) {
    if (!byTeam.has(row.team)) byTeam.set(row.team, { gk: [], df: [], md: [], st: [] })
    const bucket = byTeam.get(row.team)[row.position]
    if (bucket) bucket.push({ name: row.name, jersey: row.jersey_number })
  }

  function sortPlayers(list) {
    return list.sort((a, b) => {
      if (a.jersey != null && b.jersey != null) return a.jersey - b.jersey
      if (a.jersey != null) return -1
      if (b.jersey != null) return 1
      return a.name.localeCompare(b.name)
    })
  }

  function formatPlayer(p) {
    return p.jersey != null ? `#${p.jersey} ${p.name}` : p.name
  }

  const teams = [...byTeam.keys()].sort((a, b) => a.localeCompare(b))
  const lines = [
    "# 5-A-SIDE squads (convocatorias)",
    "",
    `Generated: ${new Date().toISOString().slice(0, 10)} from \`five_a_side_players\` (production DB).`,
    "",
    "Convocatorias reais variam por posição (ex.: 4 avançados numa seleção, 7 noutra).",
    "Total habitual: **26 jogadores** por seleção. A app de 5-A-SIDE pede **1 GR + 1 DEF + 2 MED + 1 AV** escolhidos desse plantel.",
    "Sem fotos de jogadores.",
    "",
    "Regenerate: `npm run export:squads`",
    "",
    "## Summary",
    "",
    "| Nation | Total | GK | DF | MD | ST | Placeholders | Status |",
    "|--------|------:|---:|---:|---:|---:|-------------:|--------|",
  ]

  for (const team of teams) {
    const slots = byTeam.get(team)
    const all = POS_ORDER.flatMap((p) => slots[p])
    const total = all.length
    const ph = all.filter((p) => isPlaceholder(p.name)).length
    const counts = POS_ORDER.map((p) => slots[p].length).join(" | ")
    const status =
      ph === 0 ? "Complete" : ph === total ? "Placeholder only" : `Mixed (${total - ph} real)`
    lines.push(
      `| ${team} | ${total} | ${slots.gk.length} | ${slots.df.length} | ${slots.md.length} | ${slots.st.length} | ${ph} | ${status} |`
    )
  }

  lines.push("", "---", "")

  for (const team of teams) {
    const slots = byTeam.get(team)
    lines.push(`## ${team}`, "")
    for (const pos of POS_ORDER) {
      lines.push(`### ${POS_LABEL[pos]}`, "")
      for (const name of sortPlayers([...slots[pos]])) {
        lines.push(`- ${formatPlayer(name)}`)
      }
      lines.push("")
    }
  }

  const outPath = path.join(root, "docs", "SQUADS.md")
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, lines.join("\n"), "utf8")
  console.log(`Wrote ${outPath} (${teams.length} nations, ${(data ?? []).length} players)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
