"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RankingRow } from "@/app/ranking/RankingRow"

type RankedRow = {
  user_id: string
  name: string
  matchPts: number
  groupPts: number
  specialPts: number
  fiveASidePts: number
  points: number
}

const PTS_GOAL = 4
const PTS_ASSIST = 3
const PTS_MVP_AWARD = 3
const PTS_WIN = 2
const PTS_CLEAN_SHEET = 4

export default function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: leagueId } = use(params)
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [rows, setRows] = useState<RankedRow[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  function copyCode() {
    if (!code) return
    void navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login?next=" + encodeURIComponent(`/leagues/${leagueId}`))
        return
      }
      setCurrentUserId(user.id)

      const { data: league } = await supabase
        .from("private_leagues")
        .select("name, invite_code")
        .eq("id", leagueId)
        .maybeSingle()
      if (!league) { setLoading(false); return }
      setName(league.name)
      setCode(league.invite_code)

      const { data: mem } = await supabase
        .from("private_league_members")
        .select("user_id")
        .eq("league_id", leagueId)
      const userIds = [...new Set((mem ?? []).map((m: { user_id: string }) => m.user_id))]
      if (userIds.length === 0) { setLoading(false); return }

      const [
        { data: profiles },
        { data: preds },
        { data: groupPts },
        { data: specialQuestions },
        { data: specialAnswers },
        { data: fiveASidePicks },
        { data: fiveASidePlayers },
        { data: finishedMatches },
      ] = await Promise.all([
        supabase.from("profiles").select("id, display_name").in("id", userIds),
        supabase.from("predictions").select("user_id, points, match_id, created_at").in("user_id", userIds),
        supabase.rpc("get_all_group_points"),
        supabase.from("special_questions").select("id, points, correct_answer").not("correct_answer", "is", null),
        supabase.from("special_answers").select("user_id, question_id, answer").in("user_id", userIds),
        supabase.from("five_a_side_picks").select("user_id, gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id").in("user_id", userIds),
        supabase.from("five_a_side_players").select("id, goals, assists, wins, clean_sheets, mvp"),
        supabase.from("matches").select("id").eq("status", "finished"),
      ])

      const nameById = new Map((profiles ?? []).map((p: { id: string; display_name: string | null }) => [p.id, (p.display_name ?? "").trim() || "Player"]))
      const finishedMatchIds = new Set((finishedMatches ?? []).map((m: { id: number }) => m.id))

      // Match points (only from finished matches)
      const latestByKey = new Map<string, { user_id: string; points: number | null }>()
      for (const p of preds ?? []) {
        const row = p as { user_id: string; points: number | null; match_id: number; created_at: string }
        if (!finishedMatchIds.has(row.match_id)) continue
        const key = `${row.user_id}::${row.match_id}`
        if (!latestByKey.has(key)) latestByKey.set(key, row)
      }
      const matchPtsByUser = new Map<string, number>()
      for (const [, row] of latestByKey) {
        const cur = matchPtsByUser.get(row.user_id) ?? 0
        matchPtsByUser.set(row.user_id, cur + (Number(row.points) || 0))
      }

      // Group points
      const groupPtsByUser = new Map<string, number>()
      for (const row of groupPts ?? []) {
        const r = row as { user_id: string; group_points: number }
        if (userIds.includes(r.user_id)) groupPtsByUser.set(r.user_id, r.group_points ?? 0)
      }

      // Special question points
      const pointsByQId = new Map<string, number>()
      for (const q of specialQuestions ?? []) {
        const r = q as { id: string; points: number }
        pointsByQId.set(r.id, r.points ?? 0)
      }
      const specialPtsByUser = new Map<string, number>()
      for (const a of specialAnswers ?? []) {
        const row = a as { user_id: string; question_id: string; answer: string }
        const q = (specialQuestions ?? []).find((sq: { id: string }) => sq.id === row.question_id) as { correct_answer?: string } | undefined
        const correct = (q?.correct_answer ?? "").trim().toLowerCase()
        if (!correct || (row.answer ?? "").trim().toLowerCase() !== correct) continue
        const pts = pointsByQId.get(row.question_id) ?? 0
        specialPtsByUser.set(row.user_id, (specialPtsByUser.get(row.user_id) ?? 0) + pts)
      }

      // 5-A-Side points
      const playerStatsById = new Map<string, { goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }>()
      for (const p of fiveASidePlayers ?? []) {
        const r = p as { id: string; goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }
        playerStatsById.set(r.id, { goals: Number(r.goals) || 0, assists: Number(r.assists) || 0, wins: Number(r.wins) || 0, clean_sheets: Number(r.clean_sheets) || 0, mvp: Number(r.mvp) || 0 })
      }
      const fiveASidePtsByUser = new Map<string, number>()
      for (const pick of fiveASidePicks ?? []) {
        const r = pick as { user_id: string; gk_player_id: string | null; df_player_id: string | null; md1_player_id: string | null; md2_player_id: string | null; st_player_id: string | null }
        const ids = [r.gk_player_id, r.df_player_id, r.md1_player_id, r.md2_player_id, r.st_player_id].filter(Boolean) as string[]
        let pts = 0
        for (const id of ids) {
          const s = playerStatsById.get(id)
          if (!s) continue
          pts += s.goals * PTS_GOAL + s.assists * PTS_ASSIST + s.mvp * PTS_MVP_AWARD + s.wins * PTS_WIN + s.clean_sheets * PTS_CLEAN_SHEET
        }
        if (r.user_id) fiveASidePtsByUser.set(r.user_id, pts)
      }

      const ranked: RankedRow[] = userIds.map((uid) => {
        const matchPts = matchPtsByUser.get(uid) ?? 0
        const groupPts2 = groupPtsByUser.get(uid) ?? 0
        const specialPts = specialPtsByUser.get(uid) ?? 0
        const fiveASidePts = fiveASidePtsByUser.get(uid) ?? 0
        return {
          user_id: uid,
          name: nameById.get(uid) ?? "Player",
          matchPts,
          groupPts: groupPts2,
          specialPts,
          fiveASidePts,
          points: matchPts + groupPts2 + specialPts + fiveASidePts,
        }
      }).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))

      setRows(ranked)
      setLoading(false)
    }
    load()
  }, [leagueId, router])

  if (loading) {
    return (
      <main>
        <p className="text-white/50">Loading league…</p>
      </main>
    )
  }

  if (!name) {
    return (
      <main>
        <p className="text-red-300">League not found or you don&apos;t have access.</p>
        <Link href="/leagues" className="text-wc-gold underline mt-4 inline-block">Back to leagues</Link>
      </main>
    )
  }

  return (
    <main>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
            {name}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-white/40 text-sm">
              Private league · Code: <span className="text-wc-gold/80 font-mono font-semibold">{code}</span>
            </p>
            <button
              type="button"
              onClick={copyCode}
              title="Copy invite code"
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-all duration-200 ${
                copied
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                  : "bg-white/6 border-white/15 text-white/50 hover:bg-white/12 hover:text-white hover:border-white/30"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <Link
          href="/leagues"
          className="rounded-xl px-4 py-2 text-white/50 hover:text-white/80 hover:bg-white/8 text-sm font-medium transition-all border border-transparent hover:border-white/10 shrink-0"
        >
          ← Leagues
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center border border-white/8">
          <p className="text-white/40">No members yet.</p>
        </div>
      ) : (
        <div className="glass-dark rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50">
          {/* Table header */}
          <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3 border-b border-white/10 bg-white/12">
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-center">#</div>
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider pl-2">Name</div>
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">Games</div>
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">Quest.</div>
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">Groups</div>
            <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">5-A-Side</div>
            <div className="text-[11px] font-semibold text-wc-gold/70 uppercase tracking-wider text-right">Total</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {rows.map((row, index) => (
              <div key={row.user_id} className={currentUserId === row.user_id ? "ring-1 ring-inset ring-wc-gold/20" : ""}>
                <RankingRow row={row} index={index} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 px-1">
        {[
          { label: "Games", desc: "Match predictions" },
          { label: "Quest.", desc: "Special questions" },
          { label: "Groups", desc: "Group stage" },
          { label: "5-A-Side", desc: "Fantasy team" },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white/40">{label}</span>
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-white/25">{desc}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
