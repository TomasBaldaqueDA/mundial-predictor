import type { NextRequest } from "next/server"

/** Cron jobs: Authorization Bearer CRON_SECRET or ?secret=CRON_SECRET */
export function isCronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true
  const q = request.nextUrl.searchParams.get("secret")
  return q === secret
}
