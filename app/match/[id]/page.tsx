import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { formatKickoffDisplay } from "@/lib/format-kickoff"

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ filter?: string; subFilter?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const filter = typeof sp?.filter === "string" ? sp.filter : ""
  const subFilter = typeof sp?.subFilter === "string" ? sp.subFilter : ""
  const backSearch = new URLSearchParams()
  if (filter) backSearch.set("filter", filter)
  if (subFilter) backSearch.set("subFilter", subFilter)
  const backHref = backSearch.toString() ? `/jogos?${backSearch.toString()}` : "/jogos"

  const matchId = id

  if (!matchId) {
    throw new Error("Match ID missing.")
  }

  const supabase = await createClient()
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single()

  if (matchError || !match) {
    throw new Error(matchError?.message || "Match not found")
  }

  const kickoff = new Date(match.kickoff_time)
  const now = new Date()
  const hasStarted = now >= kickoff
  const hasResult = match.score1 != null && match.score2 != null
  const isKnockout = (match.stage ?? "") !== "First Stage"
  const showPredictionsList = hasStarted || hasResult

  const { data: allPredictions, error: predError } = await supabase
    .from("predictions")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false })

  if (predError) {
    throw new Error(predError.message)
  }

  const userIds = [...new Set((allPredictions ?? []).map((p: any) => p.user_id).filter(Boolean))]
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", userIds)
    : { data: [] }
  const profileNameByUserId = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNameByUserId.set(p.id, name)
  }

  const displayName = (p: any) =>
    (p.user_id && profileNameByUserId.get(p.user_id)) ||
    (p.user_name ?? "").trim() ||
    "Anonymous"

  const latestByUser = new Map<string, any>()
  for (const p of allPredictions ?? []) {
    const createdAt = new Date(p.created_at)
    if (createdAt > kickoff) continue
    const key = p.user_id ?? ((p.user_name ?? "").trim() || "Anonymous")
    if (!latestByUser.has(key)) {
      latestByUser.set(key, p)
    }
  }

  const predictions = Array.from(latestByUser.entries())
    .map(([, p]) => ({
      name: displayName(p),
      score1: p.pred_score1,
      score2: p.pred_score2,
      mvp: p.pred_mvp,
      pred_qualifier: p.pred_qualifier ?? null,
      points: p.points ?? 0,
    }))
    .sort((a, b) => b.points - a.points)

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-wc-green-dark mb-2 flex flex-wrap items-center gap-2">
            <TeamWithFlag name={match.team1} /> vs <TeamWithFlag name={match.team2} />
          </h1>
          <p className="text-stone-500">
            {formatKickoffDisplay(String(match.kickoff_time))}
          </p>
        </div>
        <Link
          href={backHref}
          className="rounded-xl px-3 py-2 text-stone-600 hover:text-wc-gold hover:bg-wc-gold-light/30 text-sm font-medium transition-all"
        >
          ← Back to match list
        </Link>
      </div>

      {!showPredictionsList && (
        <p className="text-slate-300 rounded-xl glass border border-white/10 px-4 py-3">
          Other players&apos; predictions are <strong className="text-white">hidden</strong> until kick-off.
        </p>
      )}

      {hasResult && (
        <div className="p-4 glass rounded-2xl border-wc-gold/20">
          <p className="font-semibold text-stone-800">
            Result: {match.score1} - {match.score2}
            {match.mvp && (
              <span className="font-normal text-stone-600 ml-2">
                · MVP: {match.mvp}
              </span>
            )}
            {isKnockout && match.qualifier && (
              <span className="font-normal text-stone-600 ml-2 inline-flex items-center gap-1.5">
                · Qualified: <TeamWithFlag name={match.qualifier} />
              </span>
            )}
          </p>
        </div>
      )}

      {showPredictionsList && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Player predictions</h2>

          {predictions.length === 0 ? (
            <p className="text-stone-600 glass rounded-2xl p-6">
              No valid predictions for this match yet.
            </p>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-100/80 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-stone-700">Player</th>
                    <th className="px-4 py-3 text-left font-semibold text-stone-700">Result</th>
                    {isKnockout && (
                      <th className="px-4 py-3 text-left font-semibold text-stone-700">Qualifier</th>
                    )}
                    <th className="px-4 py-3 text-left font-semibold text-stone-700">MVP</th>
                    <th className="px-4 py-3 text-right font-semibold text-stone-700">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr key={`${p.name}-${i}`} className="border-b border-stone-100 hover:bg-wc-gold-light/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        {p.score1} - {p.score2}{" "}
                        <span className="text-stone-500">
                          ({p.score1 > p.score2 ? <><TeamWithFlag name={match.team1} suffix=" wins" /></> : p.score2 > p.score1 ? <><TeamWithFlag name={match.team2} suffix=" wins" /></> : "Draw"})
                        </span>
                      </td>
                      {isKnockout && (
                        <td className="px-4 py-3"><TeamWithFlag name={p.pred_qualifier} /></td>
                      )}
                      <td className="px-4 py-3">{p.mvp}</td>
                      <td className="px-4 py-3 text-right">{p.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

