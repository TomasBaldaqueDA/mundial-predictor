import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/cron/live-scores
 * Placeholder for external football API sync (e.g. API-Football, SportMonks).
 * Set CRON_SECRET + FOOTBALL_API_KEY (+ provider URL) in production.
 *
 * After fetching fixtures, update Supabase `matches` (score1, score2, status, mvp)
 * via supabaseAdmin — same field shapes as your admin tooling.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  const q = request.nextUrl.searchParams.get("secret")
  const ok =
    secret &&
    (auth === `Bearer ${secret}` || q === secret)
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.FOOTBALL_API_KEY && !process.env.LIVE_SCORES_API_URL) {
    return NextResponse.json({
      ok: false,
      message:
        "Not configured: set FOOTBALL_API_KEY or LIVE_SCORES_API_URL + mapping logic to push scores into public.matches.",
    })
  }

  return NextResponse.json({
    ok: true,
    message: "Stub: implement provider client and map fixture IDs to matches.id",
  })
}
