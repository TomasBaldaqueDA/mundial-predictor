import type { NextRequest } from "next/server"

/**
 * Cron jobs authenticate via Authorization: Bearer CRON_SECRET.
 * Vercel Cron sends this header automatically when CRON_SECRET is set in project env.
 * Query ?secret= is allowed only outside production (local manual triggers).
 */
export function isCronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true

  if (process.env.NODE_ENV === "production") return false

  const q = request.nextUrl.searchParams.get("secret")
  return q === secret
}

/** GET cron routes are disabled in production to avoid secret-in-URL browser leaks. */
export function isCronGetAllowed(): boolean {
  return process.env.NODE_ENV !== "production"
}
