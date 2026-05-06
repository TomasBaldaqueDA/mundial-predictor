import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function SpecialAnswersPage() {
  const supabase = await createClient()
  const [
    { data: firstMatch },
    { data: questions },
    { data: answers },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("special_questions").select("id, question, type, points, sort_order, correct_answer").order("sort_order", { ascending: true }),
    supabase.from("special_answers").select("question_id, user_id, answer").not("answer", "eq", ""),
    supabase.from("profiles").select("id, display_name"),
  ])

  const kickoff = firstMatch?.kickoff_time ? new Date(firstMatch.kickoff_time as string) : null
  const tournamentStarted = kickoff ? new Date() >= kickoff : false
  const otherQuestions = (questions ?? []).filter((q: { type: string }) => q.type !== "winner")

  const profileNames = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNames.set(p.id, name)
  }

  const byQuestion = new Map<string, { userId: string; answer: string }[]>()
  for (const a of answers ?? []) {
    const row = a as { question_id: string; user_id: string; answer: string }
    const list = byQuestion.get(row.question_id) ?? []
    list.push({ userId: row.user_id, answer: row.answer.trim() })
    byQuestion.set(row.question_id, list)
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          Special questions – answers
        </h1>
        <Link
          href="/questions"
          className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
        >
          ← Back to special questions
        </Link>
      </div>

      {!tournamentStarted && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-200 font-medium">Other players&apos; answers are hidden until the start of the World Cup.</p>
        </div>
      )}

      {tournamentStarted && otherQuestions.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-400">No other special questions.</p>
        </div>
      )}

      {tournamentStarted && otherQuestions.length > 0 && (
        <div className="space-y-8">
          {otherQuestions.map((q: { id: string; question: string; type: string; points: number; correct_answer?: string | null }) => {
            const correctAnswer = (q.correct_answer ?? "").trim()
            const correctNorm = correctAnswer.toLowerCase()
            const rows = (byQuestion.get(q.id) ?? [])
              .map((r) => {
                const correct = correctNorm !== "" && r.answer.toLowerCase() === correctNorm
                return {
                  name: profileNames.get(r.userId) ?? "Anonymous",
                  answer: r.answer,
                  correct,
                  points: correct ? q.points : 0,
                }
              })
              .filter((r) => r.answer)
              .sort((a, b) => a.name.localeCompare(b.name))
            return (
              <section key={q.id} id={`q-${q.id}`} className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className="bg-white/5 border-b border-white/10 px-5 py-3">
                  <h2 className="text-lg font-semibold text-emerald-300">
                    {q.question}
                    {q.points > 0 && (
                      <span className="text-slate-400 font-normal ml-1">({q.points} pts)</span>
                    )}
                  </h2>
                </div>
                {correctAnswer !== "" && (
                  <div className="px-5 py-3 border-b border-white/10 bg-emerald-500/10">
                    <span className="text-slate-300 font-medium">Correct answer: </span>
                    <span className="font-semibold text-emerald-200">{correctAnswer}</span>
                  </div>
                )}
                {rows.length === 0 ? (
                  <p className="px-5 py-4 text-slate-500 text-sm">No answers yet.</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-slate-300">Player</th>
                        <th className="px-5 py-3 text-left font-semibold text-slate-300">Answer</th>
                        <th className="px-5 py-3 text-right font-semibold text-wc-gold/85">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            row.correct
                              ? "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-100"
                              : correctAnswer !== ""
                                ? "bg-red-500/10 hover:bg-red-500/15 text-red-100/90"
                                : "hover:bg-white/5 text-slate-100"
                          }`}
                        >
                          <td className="px-5 py-3 font-medium">{row.name}</td>
                          <td className="px-5 py-3">{row.answer}</td>
                          <td className="px-5 py-3 text-right font-bold tabular-nums text-wc-gold">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
