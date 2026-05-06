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
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("special_questions").select("id, points, correct_answer").eq("type", "winner").limit(1).maybeSingle(),
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
      const correct =
        correctWinner !== "" && team.toLowerCase() === correctWinner.toLowerCase()
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
          href="/questions"
          className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
        >
          ← Back to special questions
        </Link>
      </div>

      {!tournamentStarted && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-200 font-medium">Winner predictions are visible only after the tournament starts.</p>
          <p className="text-sm text-slate-400 mt-1">Come back once the first match has kicked off.</p>
        </div>
      )}

      {tournamentStarted && winnerRows.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-400">No winner predictions yet.</p>
        </div>
      )}

      {tournamentStarted && winnerRows.length > 0 && (
        <div className="space-y-4">
          {correctWinner !== "" && (
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3 border border-wc-gold/30">
              <span className="text-slate-300 font-medium">Tournament winner:</span>
              <TeamWithFlag name={correctWinner} className="font-semibold text-slate-100" />
            </div>
          )}
          <div className="glass rounded-2xl overflow-x-auto border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold text-slate-300">Player</th>
                  <th className="px-5 py-4 text-left font-semibold text-slate-300">Winner prediction</th>
                  <th className="px-5 py-4 text-right font-semibold text-wc-gold/85">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {winnerRows.map((row) => (
                  <tr
                    key={row.userId}
                    className={`transition-colors ${
                      row.correct
                        ? "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-100"
                        : correctWinner !== ""
                          ? "bg-red-500/10 hover:bg-red-500/15 text-red-100/90"
                          : "hover:bg-white/5 text-slate-100"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5">
                      <TeamWithFlag name={row.team} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold tabular-nums text-wc-gold">{row.points}</td>
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
