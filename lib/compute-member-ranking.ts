import type { SupabaseClient } from "@supabase/supabase-js"

export type RankedRow = {
  userId: string
  name: string
  matchPts: number
  groupPts: number
  specialPts: number
  fiveASidePts: number
  points: number
}

const PTS_GOAL = 4
const PTS_ASSIST = 3
const PTS_MVP = 3
const PTS_WIN = 2
const PTS_CLEAN_SHEET = 4

export function rankRowId(userId: string): string {
  return `rank-row-${userId}`
}

export function rankPosition(
  ranked: RankedRow[],
  userId: string
): { rank: number; total: number } | null {
  const idx = ranked.findIndex((r) => r.userId === userId)
  if (idx < 0) return null
  return { rank: idx + 1, total: ranked.length }
}

/** Leaderboard for a set of user ids (private league members). */
export async function computeMemberRanking(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<RankedRow[]> {
  if (userIds.length === 0) return []

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
    supabase
      .from("five_a_side_picks")
      .select("user_id, gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id")
      .in("user_id", userIds),
    supabase.from("five_a_side_players").select("id, goals, assists, wins, clean_sheets, mvp"),
    supabase.from("matches").select("id").eq("status", "finished"),
  ])

  const nameById = new Map(
    (profiles ?? []).map((p: { id: string; display_name: string | null }) => [
      p.id,
      (p.display_name ?? "").trim() || "Player",
    ])
  )
  const finishedMatchIds = new Set((finishedMatches ?? []).map((m: { id: number }) => m.id))

  const latestByKey = new Map<string, { user_id: string; points: number | null }>()
  for (const p of preds ?? []) {
    const row = p as { user_id: string; points: number | null; match_id: number }
    if (!finishedMatchIds.has(row.match_id)) continue
    const key = `${row.user_id}::${row.match_id}`
    if (!latestByKey.has(key)) latestByKey.set(key, row)
  }
  const matchPtsByUser = new Map<string, number>()
  for (const [, row] of latestByKey) {
    const cur = matchPtsByUser.get(row.user_id) ?? 0
    matchPtsByUser.set(row.user_id, cur + (Number(row.points) || 0))
  }

  const groupPtsByUser = new Map<string, number>()
  for (const row of groupPts ?? []) {
    const r = row as { user_id: string; group_points: number }
    if (userIds.includes(r.user_id)) groupPtsByUser.set(r.user_id, r.group_points ?? 0)
  }

  const pointsByQId = new Map<string, number>()
  for (const q of specialQuestions ?? []) {
    const r = q as { id: string; points: number }
    pointsByQId.set(r.id, r.points ?? 0)
  }
  const specialPtsByUser = new Map<string, number>()
  for (const a of specialAnswers ?? []) {
    const row = a as { user_id: string; question_id: string; answer: string }
    const q = (specialQuestions ?? []).find((sq: { id: string }) => sq.id === row.question_id) as
      | { correct_answer?: string }
      | undefined
    const correct = (q?.correct_answer ?? "").trim().toLowerCase()
    if (!correct || (row.answer ?? "").trim().toLowerCase() !== correct) continue
    const pts = pointsByQId.get(row.question_id) ?? 0
    specialPtsByUser.set(row.user_id, (specialPtsByUser.get(row.user_id) ?? 0) + pts)
  }

  const playerStatsById = new Map<
    string,
    { goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }
  >()
  for (const p of fiveASidePlayers ?? []) {
    const r = p as { id: string; goals: number; assists: number; wins: number; clean_sheets: number; mvp: number }
    playerStatsById.set(r.id, {
      goals: Number(r.goals) || 0,
      assists: Number(r.assists) || 0,
      wins: Number(r.wins) || 0,
      clean_sheets: Number(r.clean_sheets) || 0,
      mvp: Number(r.mvp) || 0,
    })
  }
  const fiveASidePtsByUser = new Map<string, number>()
  for (const pick of fiveASidePicks ?? []) {
    const r = pick as {
      user_id: string
      gk_player_id: string | null
      df_player_id: string | null
      md1_player_id: string | null
      md2_player_id: string | null
      st_player_id: string | null
    }
    const ids = [r.gk_player_id, r.df_player_id, r.md1_player_id, r.md2_player_id, r.st_player_id].filter(
      Boolean
    ) as string[]
    let pts = 0
    for (const id of ids) {
      const s = playerStatsById.get(id)
      if (!s) continue
      pts +=
        s.goals * PTS_GOAL +
        s.assists * PTS_ASSIST +
        s.mvp * PTS_MVP +
        s.wins * PTS_WIN +
        s.clean_sheets * PTS_CLEAN_SHEET
    }
    if (r.user_id) fiveASidePtsByUser.set(r.user_id, pts)
  }

  return userIds
    .map((uid) => {
      const matchPts = matchPtsByUser.get(uid) ?? 0
      const groupPts2 = groupPtsByUser.get(uid) ?? 0
      const specialPts = specialPtsByUser.get(uid) ?? 0
      const fiveASidePts = fiveASidePtsByUser.get(uid) ?? 0
      return {
        userId: uid,
        name: nameById.get(uid) ?? "Player",
        matchPts,
        groupPts: groupPts2,
        specialPts,
        fiveASidePts,
        points: matchPts + groupPts2 + specialPts + fiveASidePts,
      }
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
}

/** Global leaderboard — all profiles with a display name. */
export async function computeGlobalRanking(supabase: SupabaseClient): Promise<RankedRow[]> {
  const { data: profiles } = await supabase.from("profiles").select("id, display_name")
  const userIds = (profiles ?? [])
    .filter((p: { display_name: string | null }) => (p.display_name ?? "").trim())
    .map((p: { id: string }) => p.id)
  return computeMemberRanking(supabase, userIds)
}
