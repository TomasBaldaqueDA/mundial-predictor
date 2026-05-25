import { NextResponse } from "next/server"

/**
 * Public readiness check (no secrets). Use after deploy to confirm Vercel env.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    host: process.env.VERCEL_URL ?? "local",
    vercel: process.env.VERCEL === "1",
    env: {
      next_public_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      next_public_supabase_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      cron_secret: !!process.env.CRON_SECRET,
      football_api_key: !!process.env.FOOTBALL_API_KEY,
      live_scores_api_url: !!process.env.LIVE_SCORES_API_URL,
    },
    cron: {
      vercel_json: "live-scores 0 12 * * *, advance-matches 10 12 * * *",
      football_league_id: process.env.FOOTBALL_API_LEAGUE_ID ?? "1",
      football_season: process.env.FOOTBALL_API_SEASON ?? "2026",
    },
  })
}
