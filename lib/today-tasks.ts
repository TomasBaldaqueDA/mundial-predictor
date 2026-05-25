import type { SupabaseClient } from "@supabase/supabase-js"

export type TodayTask = {
  id: string
  label: string
  href: string
}

const GROUP_CODES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export async function getTodayTasks(
  supabase: SupabaseClient,
  userId: string
): Promise<TodayTask[]> {
  const now = new Date()
  const tasks: TodayTask[] = []

  const [
    { data: matches },
    { data: predictions },
    { data: firstMatch },
    { data: groupPreds },
    { data: fivePick },
    { data: questions },
    { data: answers },
  ] = await Promise.all([
    supabase
      .from("matches")
      .select("id, kickoff_time, status")
      .gte("kickoff_time", now.toISOString())
      .order("kickoff_time", { ascending: true })
      .limit(80),
    supabase.from("predictions").select("match_id").eq("user_id", userId),
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("group_predictions").select("group_code, position").eq("user_id", userId),
    supabase.from("five_a_side_picks").select("submitted_at, gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id").eq("user_id", userId).maybeSingle(),
    supabase.from("special_questions").select("id, question, type").neq("type", "winner").order("sort_order"),
    supabase.from("special_answers").select("question_id, answer").eq("user_id", userId),
  ])

  const predictedIds = new Set((predictions ?? []).map((p: { match_id: number }) => p.match_id))
  const openMatches = (matches ?? []).filter(
    (m: { status?: string | null; kickoff_time: string }) =>
      m.status !== "finished" && new Date(m.kickoff_time) > now
  )
  const missingPredictions = openMatches.filter((m: { id: number }) => !predictedIds.has(m.id))
  if (missingPredictions.length > 0) {
    const n = missingPredictions.length
    tasks.push({
      id: "predictions",
      label: n === 1 ? "1 match needs your prediction" : `${n} matches need your prediction`,
      href: "/games?filter=upcoming",
    })
  }

  const kickoff = firstMatch?.kickoff_time ? new Date(firstMatch.kickoff_time as string) : null
  const tournamentLocked = kickoff ? now >= kickoff : false

  if (!tournamentLocked) {
    const byGroup = new Map<string, Set<number>>()
    for (const row of groupPreds ?? []) {
      const g = (row as { group_code: string }).group_code
      const pos = (row as { position: number }).position
      if (!byGroup.has(g)) byGroup.set(g, new Set())
      byGroup.get(g)!.add(pos)
    }
    const incompleteGroups = GROUP_CODES.filter((g) => {
      const positions = byGroup.get(g)
      return !positions || positions.size < 4
    })
    if (incompleteGroups.length > 0) {
      tasks.push({
        id: "groups",
        label:
          incompleteGroups.length === 1
            ? "Finish group standings (1 group left)"
            : `Finish group standings (${incompleteGroups.length} groups left)`,
        href: "/groups",
      })
    }

    const pick = fivePick as {
      submitted_at?: string | null
      gk_player_id?: string | null
      df_player_id?: string | null
      md1_player_id?: string | null
      md2_player_id?: string | null
      st_player_id?: string | null
    } | null
    const filled = [
      pick?.gk_player_id,
      pick?.df_player_id,
      pick?.md1_player_id,
      pick?.md2_player_id,
      pick?.st_player_id,
    ].filter(Boolean).length
    if (!pick?.submitted_at || filled < 5) {
      tasks.push({
        id: "five-a-side",
        label: pick ? "Complete and submit your 5-A-SIDE team" : "Build your 5-A-SIDE fantasy team",
        href: "/five-a-side",
      })
    }

    const answeredIds = new Set(
      (answers ?? [])
        .filter((a: { answer?: string }) => (a.answer ?? "").trim() !== "")
        .map((a: { question_id: string }) => a.question_id)
    )
    const missingQuestions = (questions ?? []).filter((q: { id: string }) => !answeredIds.has(q.id))
    if (missingQuestions.length > 0) {
      tasks.push({
        id: "questions",
        label:
          missingQuestions.length === 1
            ? "1 special question unanswered"
            : `${missingQuestions.length} special questions unanswered`,
        href: "/questions",
      })
    }
  }

  return tasks
}
