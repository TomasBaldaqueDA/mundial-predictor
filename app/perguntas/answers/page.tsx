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
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).single(),
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
          href="/perguntas"
          className="rounded-xl px-3 py-2 text-stone-600 hover:text-wc-gold hover:bg-wc-gold-light/30 text-sm font-medium transition-all"
        >
          ← Back to special questions
        </Link>
      </div>

      {!tournamentStarted && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-600 font-medium">Other players&apos; answers are hidden until the start of the World Cup.</p>
        </div>
      )}

      {tournamentStarted && otherQuestions.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-600">No other special questions.</p>
        </div>
      )}

      {tournamentStarted && otherQuestions.length > 0 && (
        <div className="space-y-8">
          {otherQuestions.map((q: { id: string; question: string; type: string; points: number; correct_answer?: string | null }) => {
            const correctAnswer = (q.correct_answer ?? "").trim()
            const rows = (byQuestion.get(q.id) ?? [])
              .map((r) => {
                const correct = correctAnswer !== "" && r.answer === correctAnswer
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
              <section key={q.id} id={`q-${q.id}`} className="glass rounded-2xl overflow-hidden shadow-lg shadow-stone-900/5">
                <div className="bg-stone-100/95 border-b-2 border-stone-200 px-5 py-3">
                  <h2 className="text-lg font-semibold text-wc-green-dark">
                    {q.question}
                    {q.points > 0 && (
                      <span className="text-stone-500 font-normal ml-1">({q.points} pts)</span>
                    )}
                  </h2>
                </div>
                {correctAnswer !== "" && (
                  <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/90 accent-bar-green">
                    <span className="text-stone-600 font-medium">Correct answer: </span>
                    <span className="font-semibold text-stone-800">{correctAnswer}</span>
                  </div>
                )}
                {rows.length === 0 ? (
                  <p className="px-5 py-4 text-stone-500 text-sm">No answers yet.</p>
                ) : (
                  <table className="min-w-full text-sm table-modern">
                    <thead className="bg-stone-50/95 border-b-2 border-stone-200">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-stone-700">Player</th>
                        <th className="px-5 py-3 text-left font-semibold text-stone-700">Answer</th>
                        <th className="px-5 py-3 text-right font-semibold text-stone-700">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-stone-100 last:border-0 transition-colors ${
                            row.correct ? "bg-wc-green-light/50 text-wc-green-dark hover:bg-wc-green-light/60" : correctAnswer !== "" ? "bg-red-50/80 text-red-800 hover:bg-red-50" : "hover:bg-wc-gold-light/20"
                          }`}
                        >
                          <td className="px-5 py-3 font-medium">{row.name}</td>
                          <td className="px-5 py-3">{row.answer}</td>
                          <td className="px-5 py-3 text-right font-medium">{row.points}</td>
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
