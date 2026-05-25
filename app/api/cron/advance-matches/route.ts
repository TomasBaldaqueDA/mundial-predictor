import { NextRequest, NextResponse } from "next/server"
import { isCronAuthorized, isCronGetAllowed } from "@/lib/cron-auth"
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
 * GET is supported outside production for manual checks (Bearer auth only).
 */
export async function GET(request: NextRequest) {
  if (!isCronGetAllowed()) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  }
  return POST(request)
}
