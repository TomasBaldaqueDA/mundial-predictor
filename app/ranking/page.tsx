import { createClient } from "@/lib/supabase/server"
import { RankingBoard } from "@/app/components/RankingBoard"
import { PageHeader } from "@/app/components/PageHeader"

export const metadata = {
  title: "Global ranking · WC26 Predictor",
  description: "Worldwide leaderboard of WC26 Predictor — match points, special questions, group bonuses and 5-A-SIDE.",
}

export default async function RankingPage() {
  const supabase = await createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  const [
    { data: matchPointsRows, error: matchPointsError },
    { data: profiles },
    { data: groupPointsRows, error: groupPointsError },
    { data: specialQuestions },
    { data: specialAnswers },
    { data: fiveASidePicks },
    { data: fiveASidePlayers },
  ] = await Promise.all([
    supabase.rpc("get_match_points_by_user"),
    supabase.from("profiles").select("id, display_name"),
    supabase.rpc("get_all_group_points"),
    supabase.from("special_questions").select("id, points, correct_answer").not("correct_answer", "is", null),
    supabase.from("special_answers").select("user_id, question_id, answer"),
    supabase.from("five_a_side_picks").select("user_id, gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id"),
    supabase.from("five_a_side_players").select("id, goals, assists, wins, clean_sheets, mvp"),
  ])
  const safeGroupPoints = groupPointsError ? [] : groupPointsRows ?? []

  const matchPointsByUserId = new Map<string, number>()
  if (matchPointsError?.code === "PGRST202") {
    const [{ data: finishedMatches }, { data: predictions }] = await Promise.all([
      supabase.from("matches").select("id").eq("status", "finished"),
      supabase.from("predictions").select("user_id, points, match_id").not("user_id", "is", null),
    ])
    const finishedIds = new Set((finishedMatches ?? []).map((m: { id: number }) => m.id))
    for (const row of predictions ?? []) {
      const r = row as { user_id: string; points: number | null; match_id: number }
      if (!finishedIds.has(r.match_id)) continue
      const current = matchPointsByUserId.get(r.user_id) ?? 0
      matchPointsByUserId.set(r.user_id, current + (r.points ?? 0))
    }
  } else if (matchPointsError) {
    throw new Error(matchPointsError.message)
  } else {
    for (const row of matchPointsRows ?? []) {
      const r = row as { user_id: string; match_points: number }
      if (r.user_id) matchPointsByUserId.set(r.user_id, Number(r.match_points) || 0)
    }
  }
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

  const ranking = Array.from(profileNameByUserId.entries())
    .map(([uid, name]) => {
      const matchPts = matchPointsByUserId.get(uid) ?? 0
      const groupPts = groupPointsByUserId.get(uid) ?? 0
      const specialPts = specialPointsByUserId.get(uid) ?? 0
      const fiveASidePts = fiveASidePointsByUserId.get(uid) ?? 0
      return {
        userId: uid,
        name,
        matchPts,
        groupPts,
        specialPts,
        fiveASidePts,
        points: matchPts + groupPts + specialPts + fiveASidePts,
      }
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))

  const myGlobalRank =
    currentUser?.id != null
      ? ranking.findIndex((r) => r.userId === currentUser.id)
      : -1
  const myRankLabel =
    myGlobalRank >= 0 ? { rank: myGlobalRank + 1, total: ranking.length } : null

  return (
    <main>
      <PageHeader
        title="Global Ranking"
        description="Overall standings across match predictions, groups, questions and 5-A-Side."
        backHref="/leagues"
        backLabel="Leagues"
        badge={
          myRankLabel ? (
            <span className="badge-pill tabular-nums">
              #{myRankLabel.rank} of {myRankLabel.total}
            </span>
          ) : undefined
        }
      />

      {ranking.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center border border-white/8">
          <p className="text-white/40">No registered users yet.</p>
        </div>
      ) : (
        <RankingBoard
          rows={ranking}
          currentUserId={currentUser?.id ?? null}
          scrollToUser
        />
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
