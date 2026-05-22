/**
 * 1) Copy imgs_cartoons/ → public/imgs_cartoons/ (Next.js static files)
 * 2) For each nation folder: replace five_a_side_players rows with real names + photo_url
 *    (pads to 26 with placeholder slots if fewer cartoon images exist)
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * If Node fails with "unable to verify the first certificate", run once:
 *   $env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run sync:squads   (PowerShell)
 */
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const REPO_ROOT = path.resolve(import.meta.dirname, "..")
const SOURCE_DIR = path.join(REPO_ROOT, "imgs_cartoons")
const PUBLIC_DIR = path.join(REPO_ROOT, "public", "imgs_cartoons")

const POSITION_SLOTS = [
  ...Array(3).fill("gk"),
  ...Array(8).fill("df"),
  ...Array(8).fill("md"),
  ...Array(7).fill("st"),
]

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const out = {}
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    let value = trimmed.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[trimmed.slice(0, idx).trim()] = value
  }
  return out
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDirRecursive(from, to)
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) fs.copyFileSync(from, to)
  }
}

function photoUrlFor(team, fileName) {
  const ext = path.extname(fileName)
  const base = fileName.slice(0, -ext.length)
  return `/imgs_cartoons/${encodeURIComponent(team)}/${encodeURIComponent(base)}${ext.toLowerCase()}`
}

function listCartoonTeams() {
  if (!fs.existsSync(SOURCE_DIR)) return []
  return fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b))
}

function playersForTeam(team) {
  const dir = path.join(SOURCE_DIR, team)
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))

  const fromImages = files.map((file, i) => {
    const name = file.replace(/\.(jpe?g|png|webp)$/i, "")
    const position = POSITION_SLOTS[i] ?? "md"
    return {
      name,
      team,
      position,
      photo_url: photoUrlFor(team, file),
    }
  })

  const out = [...fromImages]
  let slot = fromImages.length
  while (out.length < 26) {
    const position = POSITION_SLOTS[slot]
    const n = out.filter((p) => p.position === position).length + 1
    out.push({
      name: `${team} ${position.toUpperCase()} ${n}`,
      team,
      position,
      photo_url: null,
    })
    slot += 1
  }
  return out
}

async function main() {
  const env = {
    ...loadEnvFile(path.join(REPO_ROOT, ".env.example")),
    ...loadEnvFile(path.join(REPO_ROOT, ".env.local")),
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
    process.exit(1)
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`No ${SOURCE_DIR} — add nation folders with player images first.`)
    process.exit(1)
  }

  console.log("Copying cartoon images to public/imgs_cartoons …")
  if (fs.existsSync(PUBLIC_DIR)) fs.rmSync(PUBLIC_DIR, { recursive: true, force: true })
  copyDirRecursive(SOURCE_DIR, PUBLIC_DIR)

  const admin = createClient(url, key)
  const teams = listCartoonTeams()
  console.log(`Syncing ${teams.length} teams to five_a_side_players …`)

  for (const team of teams) {
    const rows = playersForTeam(team)
    const { error: delErr } = await admin.from("five_a_side_players").delete().eq("team", team)
    if (delErr) {
      console.error(`Delete failed for ${team}:`, delErr.message)
      process.exit(1)
    }
    const { error: insErr } = await admin.from("five_a_side_players").insert(rows)
    if (insErr) {
      console.error(`Insert failed for ${team}:`, insErr.message)
      process.exit(1)
    }
    const withPhoto = rows.filter((r) => r.photo_url).length
    console.log(`  ${team}: ${rows.length} players (${withPhoto} with photo)`)
  }

  const { error: rpcErr } = await admin.rpc("refresh_five_a_side_player_stats")
  if (rpcErr) console.warn("refresh_five_a_side_player_stats:", rpcErr.message)
  else console.log("Refreshed five-a-side stats from matches.")

  console.log("Done.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
