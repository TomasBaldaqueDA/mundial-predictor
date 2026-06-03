import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FiveASideLineupReadonly } from "@/app/components/FiveASideLineupReadonly"
import { PageHeader } from "@/app/components/PageHeader"
import { TournamentLockedNotice } from "@/app/components/TournamentLockedNotice"
import { isTournamentStarted } from "@/lib/tournament"
import {
  FIVE_A_SIDE_PICKS_COLUMNS,
  fetchAllFiveASidePlayers,
  hasAnyPick,
  normalizePlayer,
  teamFantasyPoints,
  type FiveASidePicks,
} from "@/lib/five-a-side"

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle()
  const name = (profile?.display_name ?? "").trim() || "Player"
  return { title: `${name} — 5-A-SIDE team` }
}

export default async function FiveASideViewTeamPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser()

  const [
    { data: picksRow },
    playersRows,
    { data: profile },
    { data: finishedRows },
    { data: firstMatch },
  ] = await Promise.all([
    supabase
      .from("five_a_side_picks")
      .select(FIVE_A_SIDE_PICKS_COLUMNS)
      .eq("user_id", userId)
      .maybeSingle(),
    fetchAllFiveASidePlayers(
      supabase,
      "id, name, team, position, jersey_number, goals, assists, wins, clean_sheets, mvp"
    ),
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
    supabase.from("matches").select("team1, team2").eq("status", "finished"),
    supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
  ])

  const tournamentStarted = isTournamentStarted(firstMatch?.kickoff_time as string | undefined)
  const isOwnTeam = sessionUser?.id === userId
  const canView = tournamentStarted || isOwnTeam

  const picks = (picksRow as FiveASidePicks | null) ?? null
  if (!hasAnyPick(picks)) notFound()

  const players = (playersRows ?? []).map((row) => normalizePlayer(row as Record<string, unknown>))
  const playersById = new Map(players.map((p) => [p.id, p]))
  const totalPts = teamFantasyPoints(picks, playersById)
  const displayName = (profile?.display_name ?? "").trim() || "Anonymous"

  const teamGpByTeam: Record<string, number> = {}
  for (const row of finishedRows ?? []) {
    const m = row as { team1?: string | null; team2?: string | null }
    if (m.team1) teamGpByTeam[m.team1] = (teamGpByTeam[m.team1] ?? 0) + 1
    if (m.team2) teamGpByTeam[m.team2] = (teamGpByTeam[m.team2] ?? 0) + 1
  }

  return (
    <main className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={`${displayName}'s 5-A-SIDE`}
        description={canView ? `Total points: ${totalPts}` : undefined}
        backHref="/five-a-side/teams"
        backLabel="All teams"
      >
        <Link href="/five-a-side" className="btn-ghost">
          My team
        </Link>
      </PageHeader>

      {!canView ? (
        <TournamentLockedNotice message="Other players' 5-A-SIDE teams are hidden until the start of the World Cup." />
      ) : (
        <FiveASideLineupReadonly picks={picks!} players={players} teamGpByTeam={teamGpByTeam} />
      )}
    </main>
  )
}
