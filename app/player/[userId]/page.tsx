import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/app/components/PageHeader"
import { notFound } from "next/navigation"
import { FiveASideLineupReadonly } from "@/app/components/FiveASideLineupReadonly"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { KickoffText } from "@/app/components/KickoffText"
import { getKickoffTimestamp } from "@/lib/format-kickoff"
import {
  FIVE_A_SIDE_PICKS_COLUMNS,
  fetchAllFiveASidePlayers,
  hasAnyPick,
  normalizePlayer,
  teamFantasyPoints,
  type FiveASidePicks,
} from "@/lib/five-a-side"
import { isTournamentStarted } from "@/lib/tournament"

const GROUP_CODES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const
const POSITION_LABELS: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" }

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle()
  const name = (profile?.display_name ?? "").trim() || "Player"
  return { title: `${name} — predictions` }
}

export default async function PlayerPredictionsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const nowIso = new Date().toISOString()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: firstMatch },
    { data: preds },
    { data: startedMatches },
    { data: groupPreds },
    { data: specialQuestions },
    { data: specialAnswers },
    { data: picksRow },
    playersRows,
    { data: actualStandings },
    { data: actualThird },
  ] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
    supabase
      .from("predictions")
      .select("id, match_id, pred_score1, pred_score2, pred_mvp, pred_qualifier, points")
      .eq("user_id", userId),
    supabase
      .from("matches")
      .select("id, team1, team2, kickoff_time, stage, score1, score2, qualifier, mvp")
      .lte("kickoff_time", nowIso)
      .order("kickoff_time", { ascending: false }),
    supabase
      .from("group_predictions")
      .select("group_code, team_name, position, qualifies")
      .eq("user_id", userId)
      .order("group_code")
      .order("position"),
    supabase.from("special_questions").select("id, question, type, points, sort_order, correct_answer").order("sort_order"),
    supabase.from("special_answers").select("question_id, answer").eq("user_id", userId),
    supabase
      .from("five_a_side_picks")
      .select(FIVE_A_SIDE_PICKS_COLUMNS)
      .eq("user_id", userId)
      .maybeSingle(),
    fetchAllFiveASidePlayers(
      supabase,
      "id, name, team, position, jersey_number, goals, assists, wins, clean_sheets, mvp, games_played"
    ).catch(() =>
      fetchAllFiveASidePlayers(
        supabase,
        "id, name, team, position, jersey_number, goals, assists, wins, clean_sheets, mvp"
      )
    ),
    supabase.from("group_actual_standings").select("group_code, position, team_name"),
    supabase.from("group_actual_third_place").select("group_code"),
  ])

  const displayName = (profile?.display_name ?? "").trim() || "Anonymous"
  const tournamentStarted = isTournamentStarted(firstMatch?.kickoff_time as string | undefined)
  const isOwnProfile = currentUser?.id === userId
  const canViewLockedSections = tournamentStarted || isOwnProfile

  const matchById = new Map(
    (startedMatches ?? []).map((m) => [
      m.id as number,
      m as {
        id: number
        team1: string
        team2: string
        kickoff_time: string
        stage: string | null
        score1: number | null
        score2: number | null
        qualifier: string | null
        mvp: string | null
      },
    ])
  )

  const matchRows = (preds ?? [])
    .map((p) => {
      const m = matchById.get(p.match_id as number)
      if (!m) return null
      const hasRes = m.score1 != null && m.score2 != null
      return {
        id: p.id as number,
        team1: m.team1,
        team2: m.team2,
        kickoff_time: m.kickoff_time,
        stage: m.stage,
        pred_score1: p.pred_score1 ?? 0,
        pred_score2: p.pred_score2 ?? 0,
        pred_mvp: (p.pred_mvp as string | null) ?? null,
        pred_qualifier: (p.pred_qualifier as string | null) ?? null,
        points: p.points as number | null,
        score1: m.score1,
        score2: m.score2,
        actual_qualifier: m.qualifier,
        actual_mvp: m.mvp,
        hasRes,
      }
    })
    .filter(Boolean) as {
    id: number
    team1: string
    team2: string
    kickoff_time: string
    stage: string | null
    pred_score1: number
    pred_score2: number
    pred_mvp: string | null
    pred_qualifier: string | null
    points: number | null
    score1: number | null
    score2: number | null
    actual_qualifier: string | null
    actual_mvp: string | null
    hasRes: boolean
  }[]

  matchRows.sort((a, b) => getKickoffTimestamp(b.kickoff_time) - getKickoffTimestamp(a.kickoff_time))

  const actualByGroup = new Map<string, Record<number, string>>()
  for (const row of actualStandings ?? []) {
    const r = row as { group_code: string; position: number; team_name: string }
    if (!actualByGroup.has(r.group_code)) actualByGroup.set(r.group_code, {})
    actualByGroup.get(r.group_code)![r.position] = r.team_name
  }
  const actualThirdSet = new Set((actualThird ?? []).map((r) => (r as { group_code: string }).group_code))

  const groupByCode = new Map<string, { positions: Record<number, string>; thirdQualifies: boolean }>()
  for (const row of groupPreds ?? []) {
    const r = row as { group_code: string; team_name: string; position: number; qualifies?: boolean }
    if (!groupByCode.has(r.group_code)) {
      groupByCode.set(r.group_code, { positions: {}, thirdQualifies: false })
    }
    const g = groupByCode.get(r.group_code)!
    g.positions[r.position] = r.team_name
    if (r.position === 3 && r.qualifies) g.thirdQualifies = true
  }

  const answerByQ = new Map<string, string>()
  for (const a of specialAnswers ?? []) {
    const row = a as { question_id: string; answer: string }
    const trimmed = (row.answer ?? "").trim()
    if (trimmed) answerByQ.set(row.question_id, trimmed)
  }

  const questions = (specialQuestions ?? []) as {
    id: string
    question: string
    type: string
    points: number
    correct_answer?: string | null
  }[]
  const otherQuestions = questions.filter((q) => q.type !== "winner")
  const winnerQuestion = questions.find((q) => q.type === "winner")

  const picks = (picksRow as FiveASidePicks | null) ?? null

  if (
    !profile &&
    !preds?.length &&
    !groupPreds?.length &&
    !specialAnswers?.length &&
    !hasAnyPick(picks)
  ) {
    notFound()
  }

  const players = (playersRows ?? []).map((row) => normalizePlayer(row as Record<string, unknown>))
  const playersById = new Map(players.map((p) => [p.id, p]))
  const fiveASidePts = teamFantasyPoints(picks, playersById)

  const thirdPlaceGroups = [...groupByCode.entries()]
    .filter(([, g]) => g.thirdQualifies)
    .map(([code]) => code)
    .sort()

  return (
    <main className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title={displayName}
        description="All predictions — matches, groups, questions and 5-A-SIDE."
        backHref="/ranking"
        backLabel="Ranking"
      />

      {!canViewLockedSections && (
        <div className="glass rounded-2xl p-6 border border-wc-gold/25 text-center">
          <p className="text-slate-200">
            Group picks, special questions and 5-A-SIDE are hidden until the World Cup starts.
          </p>
          <p className="text-xs text-slate-400 mt-2">Match predictions for games already kicked off appear below.</p>
        </div>
      )}

      {/* Match predictions */}
      <section className="space-y-3">
        <h2 className="section-title">Match predictions</h2>
        <p className="text-xs text-slate-400">Games that have already kicked off.</p>
        {matchRows.length === 0 ? (
          <p className="text-sm text-slate-500 glass rounded-xl p-4">No match predictions yet.</p>
        ) : (
          <div className="space-y-3">
            {matchRows.map((r) => (
              <div
                key={r.id}
                className="glass rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-slate-100 flex flex-wrap items-center gap-1.5 text-sm">
                    <TeamWithFlag name={r.team1} /> vs <TeamWithFlag name={r.team2} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <KickoffText kickoff={r.kickoff_time} />
                    {r.stage && <> · {r.stage}</>}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Guess:{" "}
                    <span className="font-bold tabular-nums text-slate-100">
                      {r.pred_score1}–{r.pred_score2}
                    </span>
                    {r.pred_qualifier && (
                      <>
                        {" "}
                        · Qualifier: <TeamWithFlag name={r.pred_qualifier} />
                      </>
                    )}
                  </div>
                  {r.pred_mvp && (
                    <div className="text-xs text-slate-300 mt-1">
                      MVP: <span className="text-slate-100">{r.pred_mvp}</span>
                    </div>
                  )}
                  {r.hasRes && (
                    <div className="text-xs text-emerald-300 mt-1">
                      Result:{" "}
                      <span className="font-semibold tabular-nums">
                        {r.score1}–{r.score2}
                      </span>
                      {r.actual_mvp && (
                        <>
                          {" "}
                          · MVP: <span className="text-emerald-100">{r.actual_mvp}</span>
                        </>
                      )}
                      {r.actual_qualifier && (
                        <>
                          {" "}
                          · Advances: <TeamWithFlag name={r.actual_qualifier} />
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {r.points != null && r.hasRes ? (
                    <span
                      className={`inline-block text-sm font-bold px-3 py-1 rounded-full border ${
                        r.points > 0
                          ? "bg-emerald-500/15 text-emerald-100 border-emerald-400/35"
                          : "bg-white/5 text-slate-300 border-white/10"
                      }`}
                    >
                      {r.points > 0 ? "+" : ""}
                      {r.points} pts
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {canViewLockedSections && (
        <>
          {/* Groups */}
          <section className="space-y-3">
            <h2 className="section-title">Group predictions</h2>
            {groupByCode.size === 0 && thirdPlaceGroups.length === 0 ? (
              <p className="text-sm text-slate-500 glass rounded-xl p-4">No group predictions saved.</p>
            ) : (
              <div className="space-y-4">
                {GROUP_CODES.filter((code) => groupByCode.has(code)).map((code) => {
                  const g = groupByCode.get(code)!
                  const actual = actualByGroup.get(code)
                  const hasActual = actual && [1, 2, 3, 4].every((p) => actual[p])
                  return (
                    <div key={code} className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-sm font-bold text-wc-gold mb-3">Group {code}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        {[1, 2, 3, 4].map((pos) => {
                          const team = g.positions[pos]
                          if (!team) return null
                          const ok = hasActual && actual![pos] === team
                          return (
                            <span
                              key={pos}
                              className={
                                hasActual
                                  ? ok
                                    ? "text-emerald-200"
                                    : "text-red-200/90"
                                  : "text-slate-200"
                              }
                            >
                              <span className="text-slate-400">{POSITION_LABELS[pos]}: </span>
                              <TeamWithFlag name={team} />
                            </span>
                          )
                        })}
                      </div>
                      {g.thirdQualifies && (
                        <p className="text-xs text-cyan-300/90 mt-2">3rd place marked as qualifying</p>
                      )}
                    </div>
                  )
                })}
                {thirdPlaceGroups.length > 0 && (
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-bold text-wc-gold mb-2">Third-place advancers</h3>
                    <p className="text-sm text-slate-200">
                      Groups:{" "}
                      {thirdPlaceGroups.map((code) => (
                        <span key={code} className="inline-flex items-center mr-2">
                          <span className="font-semibold">{code}</span>
                          {actualThirdSet.has(code) && (
                            <span className="text-emerald-400 text-xs ml-1">✓</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Special questions */}
          <section className="space-y-3">
            <h2 className="section-title">Special questions</h2>
            {winnerQuestion && answerByQ.has(winnerQuestion.id) && (
              <div className="glass rounded-xl p-4 border border-white/10 mb-3">
                <p className="text-sm font-medium text-slate-200">{winnerQuestion.question}</p>
                <p className="text-slate-100 mt-1">{answerByQ.get(winnerQuestion.id)}</p>
              </div>
            )}
            {otherQuestions.length === 0 ? (
              <p className="text-sm text-slate-500 glass rounded-xl p-4">No answers.</p>
            ) : (
              <div className="space-y-3">
                {otherQuestions.map((q) => {
                  const answer = answerByQ.get(q.id)
                  if (!answer) return null
                  const correctAnswer = (q.correct_answer ?? "").trim()
                  const correct =
                    correctAnswer !== "" && answer.toLowerCase() === correctAnswer.toLowerCase()
                  return (
                    <div
                      key={q.id}
                      className={`glass rounded-xl p-4 border ${
                        correctAnswer !== ""
                          ? correct
                            ? "border-emerald-400/30 bg-emerald-500/10"
                            : "border-red-400/25 bg-red-500/10"
                          : "border-white/10"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-200">
                        {q.question}
                        {q.points > 0 && (
                          <span className="text-slate-400 font-normal ml-1">({q.points} pts)</span>
                        )}
                      </p>
                      <p className="text-slate-100 mt-1">{answer}</p>
                      {correctAnswer !== "" && (
                        <p className="text-xs text-slate-400 mt-2">
                          Correct: <span className="text-emerald-200">{correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* 5-A-SIDE */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="section-title">5-A-SIDE team</h2>
              {hasAnyPick(picks) && (
                <span className="text-sm tabular-nums text-wc-gold font-semibold">{fiveASidePts} pts</span>
              )}
            </div>
            {!hasAnyPick(picks) ? (
              <p className="text-sm text-slate-500 glass rounded-xl p-4">No 5-A-SIDE team saved.</p>
            ) : (
              <FiveASideLineupReadonly picks={picks!} players={players} />
            )}
          </section>
        </>
      )}
    </main>
  )
}
