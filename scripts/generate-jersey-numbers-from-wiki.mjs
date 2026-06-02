/**
 * Parse Wikipedia 2026 World Cup squads export and generate jersey number SQL.
 * Usage: node scripts/generate-jersey-numbers-from-wiki.mjs [wiki-export.txt]
 */
import fs from "node:fs"
import path from "node:path"

const REPO = path.resolve(import.meta.dirname, "..")
const WIKI_FILE =
  process.argv[2] ||
  path.join(REPO, "agent-tools", "08404d3b-6d5a-44d6-9f39-e9995932799e.txt")
const SQUADS = JSON.parse(
  fs.readFileSync(path.join(REPO, "scripts", "squads-export.json"), "utf8")
)
const OVERRIDES = JSON.parse(
  fs.readFileSync(path.join(REPO, "scripts", "jersey-number-overrides.json"), "utf8")
)

const SKIP_TEAMS = new Set(["Brazil", "Portugal"])

const TEAM_MAP = {
  "Czech Republic": "Czechia",
  "South Korea": "Korea Republic",
  Turkey: "Türkiye",
  "United States": "USA",
  "Ivory Coast": "Côte d'Ivoire",
  "Cape Verde": "Cabo Verde",
  Iran: "IR Iran",
  "DR Congo": "Congo DR",
}

/** Map our DB player name -> Wikipedia player name */
const ALIASES = {
  "Korea Republic": {
    "Lee Kan-gin": "Lee Kang-in",
    "Cho Yu-min": "Cho Wi-je",
  },
  Morocco: { "Munir El Kajoui": "Munir Mohamedi" },
  Japan: { "Junosuke Suzuki": "Junnosuke Suzuki" },
  Haiti: {
    "Wilguens Paugvain": "Wilguens Paugain",
    "Carl-Fred Sainthe": "Carl Sainté",
    "Pierre Woodenski": "Woodensky Pierre",
  },
  Ecuador: {
    "José Ordóñez": "Joel Ordóñez",
    "William Pacho": "Willian Pacho",
    "Felix Torres": "Félix Torres",
    "Jeremy Yeboah": "John Yeboah",
    "Antonio Minda": "Alan Minda",
    "Diego Castillo": "Denil Castillo",
    "Nelson Angulo": "Nilson Angulo",
    "Jeremy Caicedo": "Jordy Caicedo",
    "Moises Ramírez": "Moisés Ramírez",
  },
  Egypt: {
    "Nabil Emad Dunga": "Nabil Emad",
    "Mahmoud Trezeguet": "Trézéguet",
    "Ahmed Sayed Zizo": "Zizo",
    "Haitham Hassan": "Haissem Hassan",
    "Hamza Abdel Karim": "Hamza Abdelkarim",
    "Mohannad Lasheen": "Mohanad Lasheen",
  },
  Ghana: { "Abdul Fatawu Issahaku": "Abdul Fatawu" },
  Norway: {
    "Fredrik Bjorkan": "Fredrik André Bjørkan",
    "Leo Ostigard": "Leo Østigård",
    "Martin Odegaard": "Martin Ødegaard",
    "Alexander Sorloth": "Alexander Sørloth",
  },
  "Cabo Verde": {
    "Diney Borges": "Diney",
    "Marcio Rosa": "Márcio Rosa",
    "CJ Dos Santos": "CJ dos Santos",
    "Sidny Cabral": "Sidny Lopes Cabral",
    "Joao Paulo Fernandes": "João Paulo",
  },
  Paraguay: {
    "Roberto Junior Fernandez": "Gatito Fernández",
    "Mauricio Magalhaes": "Maurício",
    "Briaian Ojeda": "Braian Ojeda",
    "Fabian Balbuena": "Fabián Balbuena",
    "Juan Jose Caceres": "Juan José Cáceres",
    "Gustavo Gomez": "Gustavo Gómez",
    "Alexandro Maidana": "Alexandro Maidana",
    "Gabriel Avalos": "Gabriel Ávalos",
  },
  Qatar: {
    "Hashmi Hussein": "Al-Hashmi Al-Hussain",
    "Ayoub Alawi": "Ayoub Al-Oui",
    "Issa Laaye": "Issa Laye",
    "Homam Al-Amin": "Homam Ahmed",
    "Jassem Jaber": "Jassem Gaber",
    "Tahseen Mohammed": "Tahsin Jamshid",
    "Youssef Abdulrazzaq": "Yusuf Abdurisag",
    "Mohammed Al-Manai": "Mohamed Manai",
    "Mahmoud Abunada": "Mahmud Abunada",
  },
  "Côte d'Ivoire": {
    "Mohamed Kone": "Mohamed Koné",
    "Jean-Michael Seri": "Jean Michaël Seri",
    "Christ Inao Oulai": "Christ Inao Oulaï",
    "Clement Akpa": "Christopher Opéri",
    "Bazoumana Toure": "Bazoumana Touré",
    "Nicolas Pepe": "Nicolas Pépé",
    "Guela Doué": "Guéla Doué",
  },
  Iraq: {
    "Ali Jassim": "Ali Jasim",
    "Ali Yousef": "Ali Yousif",
  },
  "IR Iran": {
    "Mehdi Ghaedi": "Mehdi Ghayedi",
  },
  Tunisia: {
    "Sabri Ben Hassan": "Sabri Ben Hessen",
    "Aymen Dahmene": "Aymen Dahmen",
  },
  "Saudi Arabia": {
    "Jehad Thikri": "Jehad Thakri",
    "Alaa Al Hajji": "Alaa Al-Hejji",
    "Hassan Tambakti": "Hassan Al-Tambakti",
    "Mohammed Al Owais": "Mohammed Al-Owais",
    "Nawaf Al Aqidi": "Nawaf Al-Aqidi",
    "Abdulelah Al Amri": "Abdulelah Al-Amri",
    "Mohammed Kanno": "Mohamed Kanno",
    "Salem Al Dawsari": "Salem Al-Dawsari",
    "Saleh Al Shehri": "Saleh Al-Shehri",
    "Firas Al Buraikan": "Firas Al-Buraikan",
    "Abdullah Al Hamdan": "Abdullah Al-Hamdan",
    "Abdullah Al Khaibari": "Abdullah Al-Khaibari",
    "Ziyad Al Johani": "Ziyad Al-Johani",
    "Nasser Al Dawsari": "Nasser Al-Dawsari",
    "Musab Al Juwayr": "Musab Al-Juwayr",
    "Khalid Al Ghannam": "Khalid Al-Ghannam",
    "Moteb Al Harbi": "Moteb Al-Harbi",
    "Mohammed Abu Al Shamat": "Mohammed Abu Al-Shamat",
  },
}

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[øØ]/g, "o")
    .replace(/[æÆ]/g, "ae")
    .replace(/[łŁ]/g, "l")
    .replace(/[đĐ]/g, "d")
    .replace(/[ß]/g, "ss")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[çÇ]/g, "c")
    .replace(/[öÖ]/g, "o")
    .replace(/[üÜ]/g, "u")
    .replace(/[''`´]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function parseWiki(text) {
  const teams = {}
  const sections = text.split(/^### /m).slice(1)
  for (const section of sections) {
    const nl = section.indexOf("\n")
    const wikiName = section.slice(0, nl).trim()
    if (wikiName === "Age" || wikiName.startsWith("Player ") || wikiName.startsWith("Coach ")) break
    const body = section.slice(nl + 1)
    const rows = [...body.matchAll(/^\| (\d+) \| [^|]+ \| ([^|]+) \|/gm)]
    if (rows.length === 0) continue
    const team = TEAM_MAP[wikiName] || wikiName
    teams[team] = {}
    for (const [, num, rawName] of rows) {
      const name = rawName.replace(/\(captain\)/gi, "").trim()
      teams[team][name] = +num
    }
  }
  return teams
}

function lookupWiki(wikiPlayers, name) {
  if (wikiPlayers[name] != null) return wikiPlayers[name]
  const n = norm(name)
  for (const [wikiName, num] of Object.entries(wikiPlayers)) {
    if (norm(wikiName) === n) return num
  }
  const ourParts = n.split(" ")
  const ourLast = ourParts[ourParts.length - 1]
  const hits = Object.entries(wikiPlayers).filter(([wikiName]) => {
    const wn = norm(wikiName)
    return wn.endsWith(" " + ourLast) || wn.split(" ").pop() === ourLast
  })
  if (hits.length === 1) return hits[0][1]
  for (const [wikiName, num] of Object.entries(wikiPlayers)) {
    const wn = norm(wikiName)
    if (ourParts.length >= 2 && wn.includes(ourParts[0]) && wn.includes(ourLast)) return num
  }
  return null
}

function matchPlayer(wikiPlayers, team, ourName) {
  const alias = ALIASES[team]?.[ourName]
  const lookupName = alias || ourName
  return lookupWiki(wikiPlayers, lookupName)
}

const wikiTeams = parseWiki(fs.readFileSync(WIKI_FILE, "utf8"))
const result = {}
const issues = []

for (const [team, players] of Object.entries(SQUADS)) {
  if (SKIP_TEAMS.has(team)) continue
  if (team === "USA") continue
  const wiki = wikiTeams[team]
  if (!wiki) {
    issues.push(`No Wikipedia data for team: ${team}`)
    continue
  }
  result[team] = {}
  for (const p of players) {
    let num =
      OVERRIDES[team]?.[p.name] != null
        ? OVERRIDES[team][p.name]
        : matchPlayer(wiki, team, p.name)
    if (num == null) {
      issues.push(`Unmatched: ${team} — ${p.name}`)
    } else {
      result[team][p.name] = num
    }
  }
}

// Fill remaining unmatched with next free numbers (only if overrides didn't cover)
for (const issue of [...issues]) {
  const m = issue.match(/^Unmatched: (.+) — (.+)$/)
  if (!m) continue
  const [, team, player] = m
  const used = new Set(Object.values(result[team] || {}))
  let free = null
  for (let i = 1; i <= 26; i++) {
    if (!used.has(i)) {
      free = i
      break
    }
  }
  if (free != null) {
    result[team][player] = free
    used.add(free)
    issues.splice(issues.indexOf(issue), 1)
    issues.push(`Fallback number ${free}: ${team} — ${player}`)
  }
}

for (const [team, map] of Object.entries(result)) {
  const nums = Object.values(map)
  const uniq = new Set(nums)
  if (uniq.size !== nums.length) {
    const dupes = nums.filter((n, i) => nums.indexOf(n) !== i)
    issues.push(`Duplicate numbers in ${team}: ${[...new Set(dupes)].join(", ")}`)
  }
}

const outJson = path.join(REPO, "scripts", "jersey-numbers-wiki.json")
fs.writeFileSync(outJson, JSON.stringify(result, null, 2), "utf8")

const sqlLines = [
  "-- National team jersey numbers (2026 World Cup official / recent international numbers).",
  "-- Excludes Brazil and Portugal (110/111). USA in 067_usa_squad.sql.",
  "",
]

for (const [team, map] of Object.entries(result).sort()) {
  const values = Object.entries(map)
    .sort((a, b) => a[1] - b[1])
    .map(([name, num]) => `  ('${name.replace(/'/g, "''")}', ${num})`)
    .join(",\n")
  sqlLines.push(`-- ${team}`)
  sqlLines.push(`UPDATE public.five_a_side_players AS p`)
  sqlLines.push(`SET jersey_number = v.num`)
  sqlLines.push(`FROM (VALUES`)
  sqlLines.push(values + `) AS v(name, num)`)
  sqlLines.push(`WHERE p.team = '${team.replace(/'/g, "''")}' AND p.name = v.name;`)
  sqlLines.push("")
}

sqlLines.push("SELECT public.refresh_five_a_side_player_stats();")
sqlLines.push("")

const sqlFile = path.join(REPO, "supabase", "sql", "112_national_jersey_numbers.sql")
fs.writeFileSync(sqlFile, sqlLines.join("\n"), "utf8")

console.log(`Teams: ${Object.keys(result).length}`)
const errors = issues.filter((i) => !i.startsWith("Fallback"))
console.log(`Errors (${errors.length}):`)
for (const i of errors.slice(0, 30)) console.log(" ", i)
const fallbacks = issues.filter((i) => i.startsWith("Fallback"))
if (fallbacks.length) console.log(`Fallbacks (${fallbacks.length}):`, fallbacks.slice(0, 10).join("; "))
console.log(`Wrote ${path.relative(REPO, sqlFile)}`)

if (errors.length > 0) process.exit(1)
