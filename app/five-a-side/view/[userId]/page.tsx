import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FiveASideLineupReadonly } from "@/app/components/FiveASideLineupReadonly"
import {
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
    { data: playersRows },
    { data: profile },
    { data: finishedRows },
  ] = await Promise.all([
    supabase
      .from("five_a_side_picks")
      .select("gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id, submitted_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("five_a_side_players").select("id, name, team, position, goals, assists, wins, clean_sheets, mvp"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
            {displayName}&apos;s 5-A-SIDE
          </h1>
          <p className="text-sm text-slate-400 mt-1 tabular-nums">
            Total points: <span className="font-semibold text-wc-gold">{totalPts}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/five-a-side/teams"
            className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
          >
            ← All teams
          </Link>
          <Link
            href="/five-a-side"
            className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
          >
            My team
          </Link>
        </div>
      </div>

      <FiveASideLineupReadonly picks={picks} players={players} teamGpByTeam={teamGpByTeam} />
    </main>
  )
}
