/**
 * Local dev entrypoint. Node on some Windows setups cannot verify Supabase TLS certs;
 * the browser can, which causes "logged in" header but middleware redirects to /login.
 */
import { spawn } from "node:child_process"

if (!process.env.CI && process.env.NODE_TLS_REJECT_UNAUTHORIZED == null) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  console.warn("⚠ dev: NODE_TLS_REJECT_UNAUTHORIZED=0 (local Supabase TLS)")
}

const nextArgs = ["next", "dev", ...process.argv.slice(2)]
const child = spawn("npx", nextArgs, {
  stdio: "inherit",
  env: process.env,
  shell: true,
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})
