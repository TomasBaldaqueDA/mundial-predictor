import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"

export default async function WinnerPredictionsPage() {
  const supabase = await createClient()
  const [
    { data: firstMatch },
    { data: winnerQuestion },
    { data: answers },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).single(),
    supabase.from("special_questions").select("id, points, correct_answer").eq("type", "winner").limit(1).single(),
    supabase.from("special_answers").select("question_id, user_id, answer").not("answer", "eq", ""),
    supabase.from("profiles").select("id, display_name"),
  ])

  const kickoff = firstMatch?.kickoff_time ? new Date(firstMatch.kickoff_time as string) : null
  const tournamentStarted = kickoff ? new Date() >= kickoff : false
  const wq = winnerQuestion as { id: string; points?: number; correct_answer?: string | null } | null
  const winnerQuestionId = wq?.id ?? null
  const winnerPoints = wq?.points ?? 0
  const correctWinner = (wq?.correct_answer ?? "").trim()

  const profileNames = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNames.set(p.id, name)
  }

  const filtered =
    winnerQuestionId
      ? (answers ?? []).filter((a: { question_id: string }) => a.question_id === winnerQuestionId)
      : []
  const winnerRows = filtered
    .map((a: { user_id: string; answer: string }) => {
      const team = a.answer.trim()
      const correct = correctWinner !== "" && team === correctWinner
      return {
        userId: a.user_id,
        name: profileNames.get(a.user_id) ?? "Anonymous",
        team,
        correct,
        points: correct ? winnerPoints : 0,
      }
    })
    .filter((r) => r.team)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          Winner predictions
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
          <p className="text-stone-600 font-medium">Winner predictions are visible only after the tournament starts.</p>
          <p className="text-sm text-stone-500 mt-1">Come back once the first match has kicked off.</p>
        </div>
      )}

      {tournamentStarted && winnerRows.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-600">No winner predictions yet.</p>
        </div>
      )}

      {tournamentStarted && winnerRows.length > 0 && (
        <div className="space-y-4">
          {correctWinner !== "" && (
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3 accent-bar-gold bg-wc-gold-light/30">
              <span className="text-stone-600 font-medium">Tournament winner:</span>
              <TeamWithFlag name={correctWinner} variant="onLight" className="font-semibold [&_img]:h-6 [&_img]:w-10" />
            </div>
          )}
          <div className="glass rounded-2xl overflow-hidden shadow-xl shadow-stone-900/5">
            <table className="min-w-full text-sm table-modern">
              <thead className="bg-stone-100/95 border-b-2 border-stone-200">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold text-stone-700">Player</th>
                  <th className="px-5 py-4 text-left font-semibold text-stone-700">Winner prediction</th>
                  <th className="px-5 py-4 text-right font-semibold text-stone-700">Points</th>
                </tr>
              </thead>
              <tbody>
                {winnerRows.map((row) => (
                  <tr
                    key={row.userId}
                    className={`border-b border-stone-100 last:border-0 transition-colors ${
                      row.correct ? "bg-wc-green-light/50 text-wc-green-dark hover:bg-wc-green-light/60" : correctWinner !== "" ? "bg-red-50/80 text-red-800 hover:bg-red-50" : "hover:bg-wc-gold-light/20"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5">
                      <TeamWithFlag name={row.team} variant="onLight" className="[&_img]:h-5 [&_img]:w-8" />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}
