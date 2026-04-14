import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

/**
 * POST /api/cron/advance-matches
 * Body/Headers: Authorization: Bearer <CRON_SECRET> or ?secret=
 * Runs advance_match_statuses() in Supabase (scheduled → started → finished).
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

  const db = supabaseAdmin
  if (!db) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 503 })
  }

  const { data, error } = await db.rpc("advance_match_statuses")
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, result: data })
}
