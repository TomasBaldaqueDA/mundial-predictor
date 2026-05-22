import { NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/cron-auth"
import { supabaseAdmin } from "@/lib/supabase-server"

/**
 * POST /api/cron/advance-matches
 * Body/Headers: Authorization: Bearer <CRON_SECRET> or ?secret=
 * Runs advance_match_statuses() in Supabase (scheduled → started → finished).
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  if (!isCronAuthorized(request)) {
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

  const durationMs = Date.now() - startedAt
  console.info(`[advance-matches] ok duration_ms=${durationMs}`)
  return NextResponse.json({ ok: true, result: data, duration_ms: durationMs })
}

/**
 * GET is supported for quick manual checks in browser/tools.
 * Security stays the same: CRON_SECRET required.
 */
export async function GET(request: NextRequest) {
  return POST(request)
}
