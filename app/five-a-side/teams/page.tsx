import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { PlayerNameLink } from "@/app/components/PlayerNameLink"
import { PageHeader } from "@/app/components/PageHeader"
import { LeagueFilterBar } from "@/app/components/LeagueFilterBar"
import { getLeagueMemberIds, isUserInLeagueFilter } from "@/lib/league-members"
import {
  FIVE_A_SIDE_PICKS_SELECT,
  fetchAllFiveASidePlayers,
  hasAnyPick,
  normalizePlayer,
  teamFantasyPoints,
  type FiveASidePicks,
  type FiveASidePlayer,
} from "@/lib/five-a-side"

export const metadata = {
  title: "5-A-SIDE teams",
  description: "View other players' 5-A-SIDE fantasy teams.",
}

export default async function FiveASideTeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const sp = await searchParams
  const leagueId = typeof sp?.league === "string" ? sp.league : ""

  const supabase = await createClient()
  const leagueMemberIds = await getLeagueMemberIds(supabase, leagueId)

  const [{ data: picksRows }, playersRows, { data: profiles }] = await Promise.all([
    supabase
      .from("five_a_side_picks")
      .select(FIVE_A_SIDE_PICKS_SELECT),
    fetchAllFiveASidePlayers(supabase, "id, name, team, position, goals, assists, wins, clean_sheets, mvp"),
    supabase.from("profiles").select("id, display_name"),
  ])

  const playersById = new Map<string, FiveASidePlayer>()
  for (const row of playersRows ?? []) {
    const p = normalizePlayer(row as Record<string, unknown>)
    playersById.set(p.id, p)
  }

  const profileNames = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNames.set(p.id, name)
  }

  const teams = (picksRows ?? [])
    .map((row) => {
      const picks = row as FiveASidePicks & { user_id: string; submitted_at: string | null }
      if (!hasAnyPick(picks)) return null
      if (!isUserInLeagueFilter(leagueMemberIds, picks.user_id)) return null
      const pts = teamFantasyPoints(picks, playersById)
      const filled = [picks.gk_player_id, picks.df_player_id, picks.md1_player_id, picks.md2_player_id, picks.st_player_id].filter(
        Boolean
      ).length
      return {
        userId: picks.user_id,
        name: profileNames.get(picks.user_id) ?? "Anonymous",
        pts,
        filled,
        complete: filled === 5,
        submitted: !!picks.submitted_at,
      }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)
    .sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name))

  const leagueQuery = leagueId ? `?league=${encodeURIComponent(leagueId)}` : ""

  return (
    <main className="space-y-6">
      <PageHeader
        title="5-A-SIDE teams"
        description="Browse every player's fantasy lineup. Teams are read-only."
        backHref="/five-a-side"
        backLabel="My team"
      />

      <LeagueFilterBar title="All teams" currentLeagueId={leagueId || undefined} />

      {teams.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-400">
            {leagueMemberIds
              ? "No 5-A-SIDE teams from players in this league yet."
              : "No 5-A-SIDE teams saved yet."}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-300">Player</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-300">Lineup</th>
                <th className="px-5 py-3 text-right font-semibold text-wc-gold/85">Points</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-300" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.map((t) => (
                <tr key={t.userId} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-100">
                    <PlayerNameLink userId={t.userId} name={t.name} className="text-slate-100" />
                  </td>
                  <td className="px-5 py-3 text-center text-slate-400 tabular-nums">
                    {t.filled}/5
                    {!t.complete && <span className="text-xs text-amber-300/90 ml-1">(incomplete)</span>}
                  </td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-wc-gold">{t.pts}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/five-a-side/view/${t.userId}${leagueQuery}`}
                      className="inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold bg-wc-green/90 text-white hover:bg-wc-green-dark transition-colors"
                    >
                      View team
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
