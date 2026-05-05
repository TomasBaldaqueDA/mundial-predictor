"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { formatKickoffDisplay } from "@/lib/format-kickoff"

export default function LeagueMemberPredictionsPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>
}) {
  const { id: leagueId, userId: targetUserId } = use(params)
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string>("")
  const [forbidden, setForbidden] = useState(false)
  const [rows, setRows] = useState<
    {
      pred_id: number
      match_id: number
      team1: string
      team2: string
      kickoff_time: string
      pred_score1: number
      pred_score2: number
      pred_mvp: string | null
      points: number | null
      score1: number | null
      score2: number | null
    }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: mem } = await supabase
        .from("private_league_members")
        .select("user_id")
        .eq("league_id", leagueId)
      const ids = new Set((mem ?? []).map((m) => m.user_id))
      if (!ids.has(user.id) || !ids.has(targetUserId)) {
        setForbidden(true)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", targetUserId).maybeSingle()
      setDisplayName((profile?.display_name ?? "").trim() || "Player")

      const { data: preds } = await supabase
        .from("predictions")
        .select("id, match_id, pred_score1, pred_score2, pred_mvp, points")
        .eq("user_id", targetUserId)
        .order("id", { ascending: false })

      const matchIds = [...new Set((preds ?? []).map((p) => p.match_id))]
      if (matchIds.length === 0) {
        setRows([])
        setLoading(false)
        return
      }

      const { data: matches } = await supabase
        .from("matches")
        .select("id, team1, team2, kickoff_time, score1, score2")
        .in("id", matchIds)

      const byMatch = new Map((matches ?? []).map((m) => [m.id, m]))

      const list = (preds ?? [])
        .map((p) => {
          const m = byMatch.get(p.match_id)
          if (!m) return null
          return {
            pred_id: p.id,
            match_id: p.match_id,
            team1: m.team1,
            team2: m.team2,
            kickoff_time: m.kickoff_time,
            pred_score1: p.pred_score1 ?? 0,
            pred_score2: p.pred_score2 ?? 0,
            pred_mvp: p.pred_mvp,
            points: p.points,
            score1: m.score1,
            score2: m.score2,
          }
        })
        .filter(Boolean) as typeof rows

      list.sort((a, b) => new Date(b.kickoff_time).getTime() - new Date(a.kickoff_time).getTime())
      setRows(list)
      setLoading(false)
    }
    load()
  }, [leagueId, targetUserId, router])

  if (loading) {
    return (
      <main>
        <p className="text-white/50">Loading…</p>
      </main>
    )
  }

  if (forbidden) {
    return (
      <main>
        <p className="text-red-300">You can’t view this profile in a league you’re not part of.</p>
        <Link href={`/leagues/${leagueId}`} className="text-wc-gold mt-4 inline-block">
          ← Back to league
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href={`/leagues/${leagueId}`} className="text-xs text-white/40 hover:text-wc-gold mb-2 inline-block">
          ← League
        </Link>
        <h1 className="text-2xl font-bold text-gradient-hero [font-family:var(--font-outfit)]">
          {displayName}&apos;s predictions
        </h1>
        <p className="text-sm text-white/45 mt-1">Visible because you share a private league.</p>
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const hasRes = r.score1 != null && r.score2 != null
          return (
            <div key={r.pred_id} className="glass rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100 flex flex-wrap items-center gap-1.5 text-sm">
                  <TeamWithFlag name={r.team1} /> vs <TeamWithFlag name={r.team2} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{formatKickoffDisplay(r.kickoff_time)}</div>
                <div className="text-xs text-slate-300 mt-1">
                  Guess: <span className="font-bold tabular-nums text-slate-100">{r.pred_score1}–{r.pred_score2}</span>
                  {r.pred_mvp && <> · MVP: <span className="text-slate-100">{r.pred_mvp}</span></>}
                </div>
                {hasRes && (
                  <div className="text-xs text-emerald-300 mt-1">
                    Result: <span className="font-semibold tabular-nums">{r.score1}–{r.score2}</span>
                  </div>
                )}
              </div>
              <div className="shrink-0 text-right">
                {r.points != null && hasRes ? (
                  <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full border ${r.points > 0 ? "bg-emerald-500/15 text-emerald-100 border-emerald-400/35" : "bg-white/5 text-slate-300 border-white/10"}`}>
                    {r.points > 0 ? "+" : ""}{r.points} pts
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Pending</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {rows.length === 0 && <p className="text-white/40 text-sm">No predictions saved yet.</p>}
    </main>
  )
}
