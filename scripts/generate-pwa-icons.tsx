#!/usr/bin/env npx tsx
/**
 * Generates PNG icons for manifest.webmanifest (run: npm run icons:generate)
 */
import { writeFileSync } from "fs"
import { join } from "path"
import { ImageResponse } from "next/og"
import { Wc26IconMark } from "../lib/wc26-icon-og"

const publicDir = join(process.cwd(), "public")

async function writeIcon(size: number, filename: string) {
  const res = new ImageResponse(<Wc26IconMark size={size} />, { width: size, height: size })
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(join(publicDir, filename), buf)
  console.log(`  ${filename} (${size}×${size}, ${buf.length} bytes)`)
}

async function main() {
  await writeIcon(48, "icon-48.png")
  await writeIcon(96, "icon-96.png")
  await writeIcon(192, "icon-192.png")
  await writeIcon(512, "icon-512.png")
  await writeIcon(180, "apple-touch-icon.png")
  const favicon48 = await new ImageResponse(<Wc26IconMark size={48} />, { width: 48, height: 48 })
  const faviconBuf = Buffer.from(await favicon48.arrayBuffer())
  writeFileSync(join(publicDir, "favicon.ico"), faviconBuf)
  console.log(`  favicon.ico (48×48, ${faviconBuf.length} bytes)`)
  console.log("PWA icons generated in public/")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
