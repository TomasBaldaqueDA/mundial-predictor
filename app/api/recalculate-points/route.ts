/**
 * POST /api/recalculate-points
 * Recalculates stored points for finished matches (matches SQL trigger logic + multiplier).
 */
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { calculateMatchPoints } from "@/lib/points"

export async function POST(request: NextRequest) {
  const db = supabaseAdmin
  if (!db) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY not set in .env.local" },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const matchIdParam = searchParams.get("matchId")

  try {
    let matches: {
      id: number
      score1: number | null
      score2: number | null
      mvp: string | null
      qualifier: string | null
    }[]

    if (matchIdParam) {
      const { data, error } = await db
        .from("matches")
        .select("id, score1, score2, mvp, qualifier")
        .eq("id", matchIdParam)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: "Match not found or invalid matchId" },
          { status: 404 }
        )
      }
      matches = [data]
    } else {
      const { data, error } = await db
        .from("matches")
        .select("id, score1, score2, mvp, qualifier")
        .not("score1", "is", null)
        .not("score2", "is", null)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      matches = data ?? []
    }

    let updated = 0

    for (const match of matches) {
      if (match.score1 === null || match.score2 === null) continue

      const { data: predictions, error: predError } = await db
        .from("predictions")
        .select("id, pred_score1, pred_score2, pred_mvp, pred_qualifier, points_multiplier")
        .eq("match_id", match.id)

      if (predError) {
        return NextResponse.json({ error: predError.message }, { status: 500 })
      }

      for (const pred of predictions ?? []) {
        const mult = pred.points_multiplier === 2 ? 2 : 1
        const points = calculateMatchPoints(
          {
            score1: Number(match.score1),
            score2: Number(match.score2),
            mvp: match.mvp,
            qualifier: match.qualifier,
          },
          {
            pred_score1: Number(pred.pred_score1),
            pred_score2: Number(pred.pred_score2),
            pred_mvp: String(pred.pred_mvp ?? ""),
            pred_qualifier: pred.pred_qualifier ?? null,
          },
          { points_multiplier: mult }
        )

        const { error: updateError } = await db
          .from("predictions")
          .update({ points })
          .eq("id", pred.id)

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
        updated++
      }
    }

    return NextResponse.json({
      ok: true,
      matchesProcessed: matches.length,
      predictionsUpdated: updated,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Recalculation failed" },
      { status: 500 }
    )
  }
}
