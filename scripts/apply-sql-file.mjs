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

const env = { ...loadEnvFile(path.join(process.cwd(), ".env.local")), ...process.env }
const url = env.NEXT_PUBLIC_SUPABASE_URL
const accessToken = env.SUPABASE_ACCESS_TOKEN
const dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL
const projectRef = url ? new URL(url).hostname.split(".")[0] : null
const sqlFile = process.argv[2] ?? "supabase/sql/118_match_appearances.sql"
const sql = fs.readFileSync(sqlFile, "utf8")

async function applyViaManagementApi(projectRef, token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Management API ${res.status}: ${text}`)
  return text
}

async function applyViaPg(connectionString, sql) {
  const { default: pg } = await import("pg")
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: process.env.QA_TLS_INSECURE !== "1" },
  })
  await client.connect()
  try {
    await client.query(sql)
  } finally {
    await client.end()
  }
}

const run =
  accessToken && projectRef
    ? () => applyViaManagementApi(projectRef, accessToken, sql)
    : dbUrl
      ? () => applyViaPg(dbUrl, sql)
      : null

if (!run) {
  console.error("Need SUPABASE_ACCESS_TOKEN or DATABASE_URL in .env.local")
  process.exit(1)
}

await run()
console.log(`Applied ${path.basename(sqlFile)}`)

// Verify Son vs bench player
const sb = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY)
const { data } = await sb
  .from("five_a_side_players")
  .select("name, team, games_played, wins, clean_sheets")
  .in("name", ["Son Heung-min", "Kim Moon-hwan", "Song Bum-keun", "Johan Vasquez"])
  .order("name")
console.log("Sample stats:", data)
