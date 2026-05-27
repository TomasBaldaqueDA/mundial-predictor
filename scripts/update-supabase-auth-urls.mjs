/**
 * Update Supabase Auth Site URL + redirect URLs (Management API).
 * Usage: node scripts/update-supabase-auth-urls.mjs
 */
import fs from "node:fs"
import path from "node:path"

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
const token = env.SUPABASE_ACCESS_TOKEN
const ref = env.NEXT_PUBLIC_SUPABASE_URL ? new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0] : "hmhzeyfuruemdqmdgqxt"

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN in .env.local")
  process.exit(1)
}

const SITE_URL = "https://www.wcup26predictor.com"
const REDIRECT_URLS = [
  "https://www.wcup26predictor.com/auth/callback",
  "https://wcup26predictor.com/auth/callback",
  "https://mundial-predictor.vercel.app/auth/callback",
  "http://localhost:3000/auth/callback",
]

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
}

const getRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, { headers })
const current = await getRes.json()
if (!getRes.ok) {
  console.error("GET failed:", getRes.status, current)
  process.exit(1)
}

const existing = new Set(
  (current.uri_allow_list ?? current.additional_redirect_urls ?? []).map((u) => u.replace(/\/$/, ""))
)
for (const u of REDIRECT_URLS) existing.add(u.replace(/\/$/, ""))

const body = {
  site_url: SITE_URL,
  uri_allow_list: [...existing],
}

const patchRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: "PATCH",
  headers,
  body: JSON.stringify(body),
})
const result = await patchRes.json()
if (!patchRes.ok) {
  console.error("PATCH failed:", patchRes.status, result)
  process.exit(1)
}

console.log("Updated Supabase auth config:")
console.log("  site_url:", result.site_url ?? SITE_URL)
console.log("  uri_allow_list:", (result.uri_allow_list ?? body.uri_allow_list).join("\n    "))
