import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FiveASideLineupReadonly } from "@/app/components/FiveASideLineupReadonly"
import { PageHeader } from "@/app/components/PageHeader"
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

  const [
    { data: picksRow },
    playersRows,
    { data: profile },
    { data: finishedRows },
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
  ])

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
        description={`Total points: ${totalPts}`}
        backHref="/five-a-side/teams"
        backLabel="All teams"
      >
        <Link href="/five-a-side" className="btn-ghost">
          My team
        </Link>
      </PageHeader>

      <FiveASideLineupReadonly picks={picks!} players={players} teamGpByTeam={teamGpByTeam} />
    </main>
  )
}
