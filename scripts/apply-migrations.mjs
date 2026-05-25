/**
 * Apply pending launch migrations (049, 050, 052) to remote Supabase.
 *
 * Auth options (first match wins):
 * 1. SUPABASE_ACCESS_TOKEN — Supabase personal access token (Dashboard → Account → Tokens)
 * 2. DATABASE_URL or SUPABASE_DB_URL — direct Postgres connection string
 *
 * Usage:
 *   $env:QA_TLS_INSECURE='1'; npm run apply:migrations
 */
import fs from "node:fs"
import path from "node:path"

if (process.env.QA_TLS_INSECURE === "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  console.warn("⚠ QA_TLS_INSECURE=1 — TLS certificate verification disabled\n")
}

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

const MIGRATIONS = [
  { name: "049_fix_recalc_trigger_and_guard", file: "049_fix_recalc_trigger_and_guard.sql" },
  { name: "050_qualifier_point", file: "050_qualifier_point.sql" },
  { name: "052_ranking_match_points_rpc", file: "052_ranking_match_points_rpc.sql" },
]

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
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: process.env.QA_TLS_INSECURE !== "1" } })
  await client.connect()
  try {
    await client.query(sql)
  } finally {
    await client.end()
  }
}

async function main() {
  const root = process.cwd()
  const env = { ...loadEnvFile(path.join(root, ".env.local")), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const accessToken = env.SUPABASE_ACCESS_TOKEN
  const dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL
  const projectRef = url ? new URL(url).hostname.split(".")[0] : null

  if (!projectRef) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local")

  const sqlDir = path.join(root, "supabase", "sql")
  const run = accessToken
    ? (sql) => applyViaManagementApi(projectRef, accessToken, sql)
    : dbUrl
      ? (sql) => applyViaPg(dbUrl, sql)
      : null

  if (!run) {
    throw new Error(
      "Need SUPABASE_ACCESS_TOKEN or DATABASE_URL in .env.local to apply DDL.\n" +
        "Get a token at: https://supabase.com/dashboard/account/tokens\n" +
        "Or add your Postgres connection string as DATABASE_URL."
    )
  }

  console.log(`Applying ${MIGRATIONS.length} migrations to project ${projectRef}...\n`)

  for (const mig of MIGRATIONS) {
    const filePath = path.join(sqlDir, mig.file)
    if (!fs.existsSync(filePath)) throw new Error(`Missing ${filePath}`)
    const sql = fs.readFileSync(filePath, "utf8")
    process.stdout.write(`→ ${mig.name} ... `)
    try {
      await run(sql)
      console.log("OK")
    } catch (e) {
      console.log("FAILED")
      throw e
    }
  }

  console.log("\n✓ All migrations applied. Run: npm run verify:migrations")
}

main().catch((e) => {
  console.error("\nApply migrations failed:", e.message)
  process.exit(1)
})
