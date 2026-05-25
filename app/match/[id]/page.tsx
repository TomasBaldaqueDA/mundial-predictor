import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { PlayerNameLink } from "@/app/components/PlayerNameLink"
import { formatKickoffDisplay } from "@/lib/format-kickoff"
import { LeagueFilter } from "@/app/components/LeagueFilter"

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ filter?: string; subFilter?: string; league?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const filter = typeof sp?.filter === "string" ? sp.filter : ""
  const subFilter = typeof sp?.subFilter === "string" ? sp.subFilter : ""
  const leagueId = typeof sp?.league === "string" ? sp.league : ""
  const backSearch = new URLSearchParams()
  if (filter) backSearch.set("filter", filter)
  if (subFilter) backSearch.set("subFilter", subFilter)
  const backHref = backSearch.toString() ? `/games?${backSearch.toString()}` : "/games"

  // Reject non-numeric ids before hitting Supabase so a typo or probe maps to 404.
  const matchIdNum = Number(id)
  if (!id || !Number.isInteger(matchIdNum) || matchIdNum <= 0) {
    notFound()
  }
  const matchId = matchIdNum

  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle()

  if (matchError) {
    throw new Error(matchError.message)
  }
  if (!match) {
    notFound()
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

  // Filter to league members if a league filter is active
  let leagueMemberIds: Set<string> | null = null
  if (leagueId) {
    const { data: members } = await supabase
      .from("private_league_members")
      .select("user_id")
      .eq("league_id", leagueId)
    if (members && members.length > 0) {
      leagueMemberIds = new Set(members.map((m: { user_id: string }) => m.user_id))
    }
  }

  type PredictionDbRow = {
    user_id: string | null
    user_name: string | null
    pred_score1: number | null
    pred_score2: number | null
    pred_mvp: string | null
    pred_qualifier: string | null
    points: number | null
    created_at: string
  }

  const preds = ((allPredictions ?? []) as PredictionDbRow[]).filter(
    (p) => !leagueMemberIds || (p.user_id != null && leagueMemberIds.has(p.user_id))
  )

  const userIds = [...new Set(preds.map((p) => p.user_id).filter(Boolean))] as string[]
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", userIds)
    : { data: [] }
  const profileNameByUserId = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNameByUserId.set(p.id, name)
  }

  const displayName = (p: PredictionDbRow) =>
    (p.user_id && profileNameByUserId.get(p.user_id)) ||
    (p.user_name ?? "").trim() ||
    "Anonymous"

  const latestByUser = new Map<string, PredictionDbRow>()
  for (const p of preds) {
    const createdAt = new Date(p.created_at)
    // For other users: only show predictions submitted before kickoff (no post-kickoff peeking)
    // For the current user: always show their own prediction (RLS already blocks post-kickoff edits)
    const isOwnRow = currentUser != null && p.user_id === currentUser.id
    if (!isOwnRow && createdAt > kickoff) continue
    const key = p.user_id ?? ((p.user_name ?? "").trim() || "Anonymous")
    if (!latestByUser.has(key)) {
      latestByUser.set(key, p)
    }
  }

  // Also ensure the current user's own prediction always appears even if league filter is active
  if (currentUser && leagueMemberIds && !leagueMemberIds.has(currentUser.id)) {
    const allPreds = (allPredictions ?? []) as PredictionDbRow[]
    const ownPred = allPreds.find((p) => p.user_id === currentUser.id)
    if (ownPred) {
      const key = currentUser.id
      if (!latestByUser.has(key)) latestByUser.set(key, ownPred)
    }
  }

  const predictions = Array.from(latestByUser.entries())
    .map(([, p]) => ({
      userId: p.user_id,
      name: displayName(p),
      score1: p.pred_score1,
      score2: p.pred_score2,
      mvp: p.pred_mvp,
      pred_qualifier: p.pred_qualifier ?? null,
      points: p.points ?? 0,
      isOwn: p.user_id != null && p.user_id === currentUser?.id,
    }))
    .sort((a, b) => b.points - a.points)

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex flex-wrap items-center gap-2">
            <TeamWithFlag name={match.team1} />
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">vs</span>
            <TeamWithFlag name={match.team2} />
          </h1>
          <p className="text-white/50 text-sm">
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
        <div className="glass rounded-2xl border border-wc-gold/30 px-5 py-4 bg-gradient-to-r from-wc-gold/10 to-transparent">
          <p className="text-xs font-bold uppercase tracking-widest text-wc-gold/70 mb-2">Final result</p>
          <div className="flex flex-wrap items-center gap-3 text-white font-bold text-lg">
            <TeamWithFlag name={match.team1} />
            <span className="text-2xl font-black tabular-nums text-white">
              {match.score1} <span className="text-white/40">–</span> {match.score2}
            </span>
            <TeamWithFlag name={match.team2} />
          </div>
          {match.mvp && (
            <p className="mt-2 text-sm text-white/70">
              <span className="text-white/40">MVP: </span>
              <span className="text-white font-semibold">{match.mvp}</span>
            </p>
          )}
          {isKnockout && match.qualifier && (
            <p className="mt-1 text-sm text-white/70 inline-flex items-center gap-1.5">
              <span className="text-white/40">Qualified: </span>
              <TeamWithFlag name={match.qualifier} />
            </p>
          )}
        </div>
      )}

      {showPredictionsList && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-100">Player predictions</h2>
            <LeagueFilter currentLeagueId={leagueId || undefined} />
          </div>

          {predictions.length === 0 ? (
            <p className="text-stone-600 glass rounded-2xl p-6">
              No valid predictions for this match yet.
            </p>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Player</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Prediction</th>
                    {isKnockout && (
                      <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Qualifier</th>
                    )}
                    <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">MVP</th>
                    <th className="px-4 py-3 text-right font-semibold text-wc-gold/80 text-xs uppercase tracking-wide">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr
                      key={`${p.name}-${i}`}
                      className={`border-b border-white/5 transition-colors ${
                        p.isOwn
                          ? "bg-wc-gold/10 hover:bg-wc-gold/15"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-100">
                        <PlayerNameLink userId={p.userId} name={p.name} className="text-slate-100" />
                        {p.isOwn && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-wc-gold/80 bg-wc-gold/15 border border-wc-gold/30 rounded-full px-1.5 py-0.5">
                            you
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        <span className="font-semibold tabular-nums">
                          {p.score1} – {p.score2}
                        </span>
                        <span className="text-white/40 ml-1.5 text-xs">
                          ({(p.score1 ?? 0) > (p.score2 ?? 0) ? (
                            <><TeamWithFlag name={match.team1} suffix=" wins" /></>
                          ) : (p.score2 ?? 0) > (p.score1 ?? 0) ? (
                            <><TeamWithFlag name={match.team2} suffix=" wins" /></>
                          ) : (
                            "Draw"
                          )})
                        </span>
                      </td>
                      {isKnockout && (
                        <td className="px-4 py-3 text-slate-200"><TeamWithFlag name={p.pred_qualifier} /></td>
                      )}
                      <td className="px-4 py-3 text-slate-200">{p.mvp}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-wc-gold">{p.points}</td>
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

