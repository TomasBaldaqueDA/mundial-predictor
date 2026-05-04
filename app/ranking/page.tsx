import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

type PredictionRow = {
  user_id: string | null
  user_name: string | null
  points: number | null
  match_id: number
  created_at: string
}

export default async function RankingPage() {
  const supabase = await createClient()
  const [
    { data: predictions, error: predError },
    { data: matches, error: matchError },
    { data: profiles },
    { data: groupPointsRows, error: groupPointsError },
    { data: specialQuestions },
    { data: specialAnswers },
    { data: fiveASidePicks },
    { data: fiveASidePlayers },
  ] = await Promise.all([
    supabase
      .from("predictions")
      .select("user_id, user_name, points, match_id, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("matches")
      .select("id, status")
      .eq("status", "finished"),
    supabase.from("profiles").select("id, display_name"),
    supabase.rpc("get_all_group_points"),
    supabase.from("special_questions").select("id, points, correct_answer").not("correct_answer", "is", null),
    supabase.from("special_answers").select("user_id, question_id, answer"),
    supabase.from("five_a_side_picks").select("user_id, gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id"),
    supabase.from("five_a_side_players").select("id, goals, assists, wins, clean_sheets, mvp"),
  ])
  const safeGroupPoints = groupPointsError ? [] : groupPointsRows ?? []

  if (predError) throw new Error(predError.message)
  if (matchError) throw new Error(matchError.message)

  const profileNameByUserId = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNameByUserId.set(p.id, name)
  }

  const groupPointsByUserId = new Map<string, number>()
  for (const row of safeGroupPoints) {
    const uid = (row as { user_id: string }).user_id
    const pts = (row as { group_points: number }).group_points ?? 0
    if (uid) groupPointsByUserId.set(uid, pts)
  }

  const pointsByQuestionId = new Map<string, number>()
  for (const q of specialQuestions ?? []) {
    const r = q as { id: string; points: number }
    pointsByQuestionId.set(r.id, r.points ?? 0)
  }
  const specialPointsByUserId = new Map<string, number>()
  for (const a of specialAnswers ?? []) {
    const row = a as { user_id: string; question_id: string; answer: string }
    const correctAnswer = (specialQuestions ?? []).find((q: { id: string }) => q.id === row.question_id) as { correct_answer?: string } | undefined
    const correct = (correctAnswer?.correct_answer ?? "").trim().toLowerCase()
    if (correct === "") continue
    const userAnswer = (row.answer ?? "").trim().toLowerCase()
    if (userAnswer !== correct) continue
    const pts = pointsByQuestionId.get(row.question_id) ?? 0
    const current = specialPointsByUserId.get(row.user_id) ?? 0
    specialPointsByUserId.set(row.user_id, current + pts)
  }

  const PTS_GOAL = 4
  const PTS_ASSIST = 3
  const PTS_MVP = 3
  const PTS_WIN = 2
  const PTS_CLEAN_SHEET = 4
  const playerStatsById = new Map<
    string,
    { goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }
  >()
  for (const p of fiveASidePlayers ?? []) {
    const row = p as { id: string; goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }
    playerStatsById.set(row.id, {
      goals: Number(row.goals) || 0,
      assists: Number(row.assists) || 0,
      wins: Number(row.wins) || 0,
      clean_sheets: Number(row.clean_sheets) || 0,
      mvp: Number(row.mvp) || 0,
    })
  }
  const fiveASidePointsByUserId = new Map<string, number>()
  for (const pick of fiveASidePicks ?? []) {
    const row = pick as {
      user_id: string
      gk_player_id: string | null
      df_player_id: string | null
      md1_player_id: string | null
      md2_player_id: string | null
      st_player_id: string | null
    }
    const ids = [row.gk_player_id, row.df_player_id, row.md1_player_id, row.md2_player_id, row.st_player_id].filter(Boolean) as string[]
    let pts = 0
    for (const id of ids) {
      const s = playerStatsById.get(id)
      if (!s) continue
      pts += s.goals * PTS_GOAL + s.assists * PTS_ASSIST + s.mvp * PTS_MVP + s.wins * PTS_WIN + s.clean_sheets * PTS_CLEAN_SHEET
    }
    if (row.user_id) fiveASidePointsByUserId.set(row.user_id, pts)
  }

  const finishedMatchIds = new Set((matches ?? []).map((m: { id: number }) => m.id))
  const rows: PredictionRow[] = (predictions ?? []).map((row: any) => ({
    user_id: row.user_id ?? null,
    user_name: row.user_name ?? null,
    points: row.points,
    match_id: row.match_id,
    created_at: row.created_at,
  }))

  const latestPerUserAndMatch = new Map<string, PredictionRow>()
  for (const row of rows) {
    if (!row.user_id || !finishedMatchIds.has(row.match_id)) continue
    const key = `${row.user_id}::${row.match_id}`
    if (!latestPerUserAndMatch.has(key)) {
      latestPerUserAndMatch.set(key, row)
    }
  }

  const totalsFromPredictions = new Map<string, number>()
  for (const [, row] of latestPerUserAndMatch) {
    const uid = row.user_id!
    const pts = row.points ?? 0
    const current = totalsFromPredictions.get(uid) ?? 0
    totalsFromPredictions.set(uid, current + pts)
  }

  const ranking = Array.from(profileNameByUserId.entries())
    .map(([uid, name]) => {
      const matchPts = totalsFromPredictions.get(uid) ?? 0
      const groupPts = groupPointsByUserId.get(uid) ?? 0
      const specialPts = specialPointsByUserId.get(uid) ?? 0
      const fiveASidePts = fiveASidePointsByUserId.get(uid) ?? 0
      return {
        name,
        matchPts,
        groupPts,
        specialPts,
        fiveASidePts,
        points: matchPts + groupPts + specialPts + fiveASidePts,
      }
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))

  const podium = (i: number) => {
    if (i === 0) return { emoji: "🥇", bg: "bg-amber-400/10 border-amber-400/25", text: "text-amber-400" }
    if (i === 1) return { emoji: "🥈", bg: "bg-slate-400/10 border-slate-400/20", text: "text-slate-300" }
    if (i === 2) return { emoji: "🥉", bg: "bg-amber-700/10 border-amber-700/20", text: "text-amber-600" }
    return null
  }

  return (
    <main>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
            Global League
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Overall standings · WC26 Predictor</p>
        </div>
        <Link
          href="/jogos"
          className="rounded-xl px-4 py-2 text-white/50 hover:text-white/80 hover:bg-white/8 text-sm font-medium transition-all border border-transparent hover:border-white/10"
        >
          ← Games
        </Link>
      </div>

      {ranking.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center border border-white/8">
          <p className="text-white/40">No registered users yet.</p>
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
            {ranking.map((row, index) => {
              const pod = podium(index)
              return (
                <div
                  key={`${row.name}-${index}`}
                  className={`grid grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3.5 items-center transition-colors duration-150 hover:bg-white/10 ${
                    pod ? pod.bg + " border-l-2" : "border-l-2 border-transparent"
                  }`}
                >
                  {/* Position */}
                  <div className="flex items-center justify-center">
                    {pod ? (
                      <span className="text-xl leading-none" aria-label={`Place ${index + 1}`}>{pod.emoji}</span>
                    ) : (
                      <span className="text-sm font-semibold text-white/35 tabular-nums">{index + 1}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className={`pl-2 font-semibold text-sm truncate ${pod ? pod.text : "text-white/85"}`}>
                    {row.name}
                  </div>

                  {/* Breakdown — hidden on mobile */}
                  <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.matchPts}</div>
                  <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.specialPts}</div>
                  <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.groupPts}</div>
                  <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.fiveASidePts}</div>

                  {/* Total */}
                  <div className={`text-right font-black text-base tabular-nums ${pod ? "text-wc-gold" : "text-white/90"}`}>
                    {row.points}
                  </div>
                </div>
              )
            })}
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
