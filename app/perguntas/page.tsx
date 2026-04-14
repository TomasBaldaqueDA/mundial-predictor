"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { ResultIcon } from "@/app/components/ResultIcon"
import { TEAMS_BY_GROUP } from "@/lib/team-flags"

type Question = {
  id: string
  question: string
  type: string
  points: number
  sort_order: number
  options?: string[]
  correct_answer?: string | null
}

const ALL_TEAMS = TEAMS_BY_GROUP.flatMap((g) => g.teams)

export default function PerguntasPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [firstMatchKickoff, setFirstMatchKickoff] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [winnerModalOpen, setWinnerModalOpen] = useState(false)
  const [winnerQuestionId, setWinnerQuestionId] = useState<string | null>(null)
  const [pendingWinner, setPendingWinner] = useState<string | null>(null)
  const [answersLocked, setAnswersLocked] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [
        { data: qRows },
        { data: { user: u } },
        { data: firstMatch },
      ] = await Promise.all([
        supabase
          .from("special_questions")
          .select("id, question, type, points, sort_order, options, correct_answer")
          .order("sort_order", { ascending: true }),
        supabase.auth.getUser(),
        supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).single(),
      ])
      setQuestions(
        (qRows ?? []).map((q: Question & { options?: unknown }) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
        }))
      )
      setUser(u ?? null)
      if (firstMatch?.kickoff_time) setFirstMatchKickoff(firstMatch.kickoff_time as string)

      if (u) {
        const [
          { data: aRows },
          { data: profile },
        ] = await Promise.all([
          supabase.from("special_answers").select("question_id, answer").eq("user_id", u.id),
          supabase.from("profiles").select("special_answers_submitted_at").eq("id", u.id).single(),
        ])
        const byQ: Record<string, string> = {}
        for (const row of aRows ?? []) {
          byQ[(row as { question_id: string }).question_id] = (row as { answer: string }).answer ?? ""
        }
        setAnswers(byQ)
        const hasAnyAnswer = (aRows ?? []).length > 0
        const submittedAt = (profile as { special_answers_submitted_at?: string } | null)?.special_answers_submitted_at
        // Only consider answers locked when the user has explicitly submitted at least once
        // and there is at least one saved answer. If there are no answers yet, keep in edit mode.
        if (submittedAt && hasAnyAnswer) {
          setAnswersLocked(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const locked = firstMatchKickoff ? new Date() >= new Date(firstMatchKickoff) : false
  const winnerQuestion = questions.find((q) => q.type === "winner")
  const otherQuestions = questions.filter((q) => q.type !== "winner")
  const formLocked = locked || answersLocked

  function openWinnerModal() {
    if (winnerQuestion) setWinnerQuestionId(winnerQuestion.id)
    setPendingWinner(null)
    setWinnerModalOpen(true)
  }

  async function confirmWinnerSelection() {
    if (!pendingWinner || !winnerQuestionId || !user || locked) return
    setAnswers((prev) => ({ ...prev, [winnerQuestionId]: pendingWinner }))
    const supabase = createClient()
    await supabase.from("special_answers").upsert(
      {
        user_id: user.id,
        question_id: winnerQuestionId,
        answer: pendingWinner,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    )
    setWinnerModalOpen(false)
    setWinnerQuestionId(null)
    setPendingWinner(null)
  }

  async function saveAnswer(questionId: string, value: string) {
    if (!user || locked) return
    // In edit mode we only update local state; answers are persisted
    // to the database when the user clicks "Save answers".
    setAnswers((prev) => ({ ...prev, [questionId]: value.trim() }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || locked) return
    setMessage(null)
    setSaving(true)
    const supabase = createClient()
    for (const q of questions) {
      let answer = (answers[q.id] ?? "").trim()
      if (q.type === "number" && answer !== "") {
        const n = Number(answer)
        if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
          setSaving(false)
          setMessage({ type: "error", text: `Use a whole number ≥ 0 for: ${q.question}` })
          return
        }
        answer = String(Math.max(0, n))
      }
      await supabase.from("special_answers").upsert(
        {
          user_id: user.id,
          question_id: q.id,
          answer,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,question_id" }
      )
    }
    await supabase.from("profiles").update({ special_answers_submitted_at: new Date().toISOString() }).eq("id", user.id)
    setSaving(false)
    setMessage({ type: "ok", text: "Answers saved." })
    setAnswersLocked(true)
  }

  if (loading) {
    return (
      <main>
        <p className="text-slate-400">Loading…</p>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          Special questions
        </h1>
        <Link
          href="/"
          className="rounded-xl px-3 py-2 text-white/90 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all page-intro-on-stadium"
        >
          ← Back
        </Link>
      </div>

      <p className="page-intro-on-stadium text-sm leading-relaxed max-w-2xl">
        Answer before the tournament starts. Answers are locked when the first match kicks off.
      </p>

      {locked && (
        <div className="rounded-xl bg-wc-gold-light/50 border border-wc-gold/30 px-4 py-3 text-wc-gold-dark font-medium">
          Questions locked — the tournament has started.
        </div>
      )}

      {!user && !locked && (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-slate-400 mb-2">Sign in to answer the questions.</p>
          <Link href="/login" className="text-wc-gold font-semibold hover:underline">
            Log in
          </Link>
        </div>
      )}

      {/* Separate Winner box – before the questions card */}
      {winnerQuestion && user && (
        <div
          className={`relative rounded-2xl p-6 sm:p-8 text-center overflow-hidden transition-all duration-300 border-2 shadow-[0_0_48px_rgba(217,119,6,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] ${
            locked
              ? "border-amber-600/70 bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200"
              : "border-amber-400/90 bg-gradient-to-br from-[#1a1206] via-[#2d210c] to-[#0c0904]"
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 85% 65% at 50% -15%, rgba(251,191,36,0.35) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 80% 100%, rgba(180,83,9,0.2) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #fcd34d 0px, #fcd34d 1px, transparent 1px, transparent 6px)",
            }}
          />
          <Link
            href="/perguntas/winners"
            className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 px-3 py-1.5 text-xs font-semibold shadow-lg shadow-amber-900/40 hover:from-amber-600 hover:to-amber-800 hover:scale-[1.02] transition-all duration-200 z-10 ring-1 ring-amber-400/40"
          >
            View predictions
          </Link>
          {!locked && (
            <button
              type="button"
              onClick={openWinnerModal}
              className="absolute top-3 right-3 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 text-amber-950 px-3 py-1.5 text-xs font-bold shadow-lg shadow-amber-900/30 hover:from-yellow-200 hover:to-amber-400 hover:scale-[1.02] transition-all duration-200 z-10 ring-1 ring-amber-200/80"
            >
              {answers[winnerQuestion.id] ? "Edit winner" : "Save winner"}
            </button>
          )}
          <div className="relative z-[1]">
            <p
              className={`text-4xl sm:text-5xl font-black mb-4 uppercase tracking-[0.12em] ${
                locked
                  ? "text-amber-900 drop-shadow-sm"
                  : "text-amber-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95),0_0_28px_rgba(251,191,36,0.35)]"
              }`}
            >
              Winner
              {winnerQuestion.points > 0 && (
                <span
                  className={`ml-2 text-xl font-semibold normal-case tracking-normal ${
                    locked ? "text-amber-800" : "text-amber-200/95"
                  }`}
                >
                  ({winnerQuestion.points} pts)
                </span>
              )}
            </p>
            {locked ? (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl border-2 border-amber-500/80 bg-amber-50/95 px-5 py-3 text-amber-950 inline-flex items-center gap-3 shadow-md shadow-amber-900/10">
                  {answers[winnerQuestion.id] ? (
                    <TeamWithFlag
                      name={answers[winnerQuestion.id]}
                      variant="onLight"
                      className="text-lg font-medium [&_img]:h-8 [&_img]:w-12"
                    />
                  ) : (
                    "—"
                  )}
                </div>
                <span className="text-sm font-medium text-amber-900/70">(locked)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={!locked ? openWinnerModal : undefined}
                className="inline-flex items-center gap-3 rounded-xl border-2 border-amber-400/90 bg-gradient-to-b from-amber-50 to-amber-100/95 px-5 py-3 text-amber-950 [&_img]:h-8 [&_img]:w-12 [&_img]:rounded shadow-[0_4px_24px_rgba(180,83,9,0.25)] cursor-pointer hover:border-amber-300 hover:from-amber-100 hover:to-amber-200 transition-all backdrop-blur-sm ring-1 ring-amber-200/60"
              >
                {answers[winnerQuestion.id] ? (
                  <TeamWithFlag
                    name={answers[winnerQuestion.id]}
                    variant="onLight"
                    className="text-lg font-medium [&_img]:h-8 [&_img]:w-12"
                  />
                ) : (
                  <span className="text-amber-800/70 font-semibold text-lg">—</span>
                )}
              </button>
            )}
            {(locked || formLocked) && (winnerQuestion.correct_answer ?? "").trim() !== "" && (() => {
              const wUserAnswer = (answers[winnerQuestion.id] ?? "").trim()
              const wCorrect = (winnerQuestion.correct_answer ?? "").trim()
              const wCorrectResult = wUserAnswer === wCorrect
              return (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <ResultIcon correct={wCorrectResult} className="h-7 w-7" />
                  {wCorrectResult ? (
                    <span className="text-xl font-bold text-amber-700">{winnerQuestion.points} pts</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-red-600">0 pts</span>
                      <span className={locked ? "text-amber-900/85" : "text-amber-100/90"}>
                        Correct: <TeamWithFlag name={wCorrect} className="[&_img]:h-5 [&_img]:w-8 inline-flex" />
                      </span>
                    </>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {questions.length === 0 && otherQuestions.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-400">No special questions yet. Check back later.</p>
        </div>
      )}

      {otherQuestions.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-5 transition-colors border-2 border-wc-green-dark/25 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {locked && (
              <p className="text-sm text-slate-400">
                Your answers (read-only):
              </p>
            )}
            <Link
              href="/perguntas/answers"
              className="rounded-full bg-wc-green/95 text-white px-3 py-1.5 text-xs font-semibold hover:bg-wc-green shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ml-auto"
            >
              View answers
            </Link>
          </div>
          {answersLocked && !locked && (
            <p className="text-sm text-slate-400">
              Answers saved. Click Edit answers to change them.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {otherQuestions.map((q) => {
              const isChoice = q.type === "choice" && (q.options?.length ?? 0) > 0
              const opts = (q.options ?? []) as string[]
              const letters = "ABCDEFGH"
              const correctAnswer = (q.correct_answer ?? "").trim()
              const userAnswer = (answers[q.id] ?? "").trim()
              const hasResult = formLocked && correctAnswer !== ""
              const isCorrect = hasResult && userAnswer === correctAnswer
              return (
                <div
                  key={q.id}
                  className={`rounded-xl px-4 py-4 space-y-2 border-2 ${
                    hasResult
                      ? isCorrect
                        ? "bg-emerald-500/15 border-emerald-400/40"
                        : "bg-red-500/12 border-red-400/45"
                      : "bg-slate-900/50 border-white/12 shadow-sm backdrop-blur-sm"
                  }`}
                >
                  <p className="text-lg font-semibold text-emerald-200">
                    {q.question}
                    {q.points > 0 && (
                      <span className="text-slate-400 font-normal ml-1">({q.points} pts)</span>
                    )}
                  </p>
                  {isChoice ? (
                    <div className="grid grid-cols-2 gap-2">
                      {formLocked ? (
                        <p className="col-span-2 rounded-lg border border-white/12 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                          {answers[q.id] || "—"}
                        </p>
                      ) : (
                        opts.map((option, idx) => {
                          const selected = answers[q.id] === option
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => user && !locked && saveAnswer(q.id, option)}
                              className={`group flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-all duration-200 ${
                                selected
                                  ? "border-amber-400 bg-amber-400/88 text-slate-950 shadow-md ring-2 ring-amber-400/40 scale-[1.02]"
                                  : "border-white/15 bg-slate-800/75 text-slate-100 hover:border-amber-400/70 hover:bg-amber-100 hover:text-slate-900 hover:scale-[1.01]"
                              }`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                  selected
                                    ? "bg-slate-900 text-amber-200"
                                    : "bg-slate-700 text-slate-200 group-hover:bg-amber-600 group-hover:text-white"
                                }`}
                              >
                                {letters[idx] ?? idx + 1}
                              </span>
                              <span className="text-sm">{option}</span>
                            </button>
                          )
                        })
                      )}
                    </div>
                  ) : (
                    <>
                      {formLocked ? (
                        q.type === "number" ? (
                          <div
                            id={`q-${q.id}`}
                            className="inline-flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border-2 border-cyan-500/30 bg-slate-900/70 text-xl sm:text-2xl font-black tabular-nums text-slate-100"
                            aria-label="Your answer"
                          >
                            {answers[q.id] || "—"}
                          </div>
                        ) : (
                          <p id={`q-${q.id}`} className="rounded-xl border border-white/12 bg-slate-900/60 px-4 py-2.5 text-slate-200">
                            {answers[q.id] || "—"}
                          </p>
                        )
                      ) : q.type === "number" ? (
                        <input
                          id={`q-${q.id}`}
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          value={answers[q.id] ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value
                            if (raw === "") {
                              setAnswers((prev) => ({ ...prev, [q.id]: "" }))
                              return
                            }
                            const n = Number(raw)
                            if (!Number.isFinite(n) || n < 0) return
                            setAnswers((prev) => ({ ...prev, [q.id]: String(Math.floor(n)) }))
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") e.preventDefault()
                          }}
                          className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 px-1 py-0 border-2 border-cyan-500/25 rounded-xl bg-slate-900/80 text-slate-50 font-black text-xl sm:text-2xl tabular-nums text-center focus:border-wc-gold focus:ring-2 focus:ring-wc-gold/35 focus:outline-none box-border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          placeholder="0"
                          readOnly={!user}
                          aria-label="Your answer (non-negative whole number)"
                        />
                      ) : (
                        <input
                          id={`q-${q.id}`}
                          type="text"
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full px-4 py-2.5 border-2 border-wc-green/25 rounded-xl focus:ring-2 focus:ring-wc-gold/50 focus:border-wc-gold bg-white/95 text-stone-800"
                          placeholder="Your answer"
                          readOnly={!user}
                        />
                      )}
                    </>
                  )}
                  {hasResult && (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <ResultIcon correct={isCorrect} className="h-7 w-7" />
                      {isCorrect ? (
                        <span className="text-xl font-bold text-wc-green-dark">{q.points} pts</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-red-600">0 pts</span>
                          <span className="text-slate-400">
                            Correct answer: <span className="font-medium text-slate-100">{q.correct_answer}</span>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {message && (
              <p
                className={`text-sm rounded-lg px-3 py-2 ${message.type === "ok" ? "text-wc-green bg-wc-green-light/50" : "text-red-600 bg-red-50"}`}
                role="alert"
              >
                {message.text}
              </p>
            )}
            {user && !locked && otherQuestions.length > 0 && !answersLocked && (() => {
              const winnerAnswered = !winnerQuestion || (answers[winnerQuestion.id] ?? "").trim() !== ""
              const allOtherAnswered = otherQuestions.every((q) => (answers[q.id] ?? "").trim() !== "")
              const allAnswered = winnerAnswered && allOtherAnswered
              return (
                <button
                  type="submit"
                  disabled={saving || !allAnswered}
                  className="btn-primary rounded-xl py-3 px-6 disabled:opacity-50 disabled:transform-none"
                >
                  {saving ? "Saving…" : "Save answers"}
                </button>
              )
            })()}
          </form>
          {user && !locked && otherQuestions.length > 0 && answersLocked && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setAnswersLocked(false)
              }}
              className="rounded-xl border-2 border-amber-400/45 bg-slate-800/80 py-3 px-6 mt-5 font-semibold text-amber-200 hover:bg-amber-500/15 hover:border-amber-300/60 transition-all duration-200"
            >
              Edit answers
            </button>
          )}
        </div>
      )}

      {/* Winner picker modal – choose team then Confirm */}
      {winnerModalOpen && winnerQuestionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => { setWinnerModalOpen(false); setPendingWinner(null) }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose winner"
        >
          <div
            className="glass rounded-2xl max-h-[85vh] w-full max-w-lg overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between bg-slate-950/85">
              <h2 className="text-lg font-bold text-amber-200 tracking-tight">Choose champion</h2>
              <button
                type="button"
                onClick={() => { setWinnerModalOpen(false); setPendingWinner(null) }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_TEAMS.map((team) => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setPendingWinner(team)}
                    className={`group flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
                      pendingWinner === team
                        ? "border-amber-400 bg-amber-400/88 text-slate-950 shadow-md ring-1 ring-amber-400/30"
                        : "border-white/12 bg-slate-800/80 text-slate-100 hover:border-amber-400/60 hover:bg-amber-100 hover:text-slate-900 [&>span>span]:group-hover:text-slate-900"
                    }`}
                  >
                    <TeamWithFlag name={team} variant={pendingWinner === team ? "onLight" : "onDark"} />
                  </button>
                ))}
              </div>
            </div>
            {pendingWinner && (
              <div className="border-t border-white/10 p-4 bg-slate-950/75 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-200 inline-flex items-center gap-2">
                  Selected: <TeamWithFlag name={pendingWinner} />
                </span>
                <button
                  type="button"
                  onClick={confirmWinnerSelection}
                  className="btn-primary py-2.5 px-5 text-sm shrink-0"
                >
                  Confirm selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
