import type { SupabaseClient } from "@supabase/supabase-js"

export type PlayerStats = {
  goals: number
  assists: number
  wins: number
  clean_sheets: number
  mvp: number
}

export type FiveASidePlayer = {
  id: string
  name: string
  team: string
  position: string
  jersey_number?: number | null
  goals: number
  assists: number
  wins: number
  clean_sheets: number
  mvp: number
}

export type FiveASidePicks = {
  gk_player_id: string | null
  df_player_id: string | null
  md1_player_id: string | null
  md2_player_id: string | null
  st_player_id: string | null
  submitted_at?: string | null
  captain_player_id?: string | null
  captain_set_at?: string | null
  supersub_slot?: SlotKey | null
  supersub_out_player_id?: string | null
  supersub_in_player_id?: string | null
  supersub_applied_at?: string | null
  supersub_out_stats?: PlayerStats | null
  supersub_in_baseline?: PlayerStats | null
}

export const SLOT_KEYS = ["gk", "df", "md1", "md2", "st"] as const
export type SlotKey = (typeof SLOT_KEYS)[number]

export const LINEUP_SLOTS: { slot: SlotKey; badge: string; label: string }[] = [
  { slot: "gk", badge: "GK", label: "Goalkeeper" },
  { slot: "df", badge: "DF", label: "Defender" },
  { slot: "md1", badge: "MF", label: "Midfielder" },
  { slot: "md2", badge: "MF", label: "Midfielder" },
  { slot: "st", badge: "FW", label: "Forward" },
]

export const FIVE_A_SIDE_PTS = {
  GOAL: 4,
  ASSIST: 3,
  MVP: 3,
  WIN: 2,
  CLEAN_SHEET: 4,
} as const

const ZERO_STATS: PlayerStats = {
  goals: 0,
  assists: 0,
  wins: 0,
  clean_sheets: 0,
  mvp: 0,
}

export function pickIdForSlot(picks: FiveASidePicks | null, slot: SlotKey): string | null {
  if (!picks) return null
  switch (slot) {
    case "gk":
      return picks.gk_player_id
    case "df":
      return picks.df_player_id
    case "md1":
      return picks.md1_player_id
    case "md2":
      return picks.md2_player_id
    case "st":
      return picks.st_player_id
    default:
      return null
  }
}

export function statsFromPlayer(p: Pick<FiveASidePlayer, "goals" | "assists" | "mvp" | "wins" | "clean_sheets">): PlayerStats {
  return {
    goals: Number(p.goals) || 0,
    assists: Number(p.assists) || 0,
    wins: Number(p.wins) || 0,
    clean_sheets: Number(p.clean_sheets) || 0,
    mvp: Number(p.mvp) || 0,
  }
}

export function parsePlayerStats(value: unknown): PlayerStats | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  return {
    goals: Number(row.goals) || 0,
    assists: Number(row.assists) || 0,
    wins: Number(row.wins) || 0,
    clean_sheets: Number(row.clean_sheets) || 0,
    mvp: Number(row.mvp) || 0,
  }
}

export function statsDelta(current: PlayerStats, baseline: PlayerStats): PlayerStats {
  return {
    goals: Math.max(0, current.goals - baseline.goals),
    assists: Math.max(0, current.assists - baseline.assists),
    wins: Math.max(0, current.wins - baseline.wins),
    clean_sheets: Math.max(0, current.clean_sheets - baseline.clean_sheets),
    mvp: Math.max(0, current.mvp - baseline.mvp),
  }
}

export function playerFantasyPoints(p: PlayerStats): number {
  return (
    p.goals * FIVE_A_SIDE_PTS.GOAL +
    p.assists * FIVE_A_SIDE_PTS.ASSIST +
    p.mvp * FIVE_A_SIDE_PTS.MVP +
    p.wins * FIVE_A_SIDE_PTS.WIN +
    p.clean_sheets * FIVE_A_SIDE_PTS.CLEAN_SHEET
  )
}

export function slotFantasyPoints(
  picks: FiveASidePicks | null,
  slot: SlotKey,
  playersById: Map<string, FiveASidePlayer>
): number {
  if (!picks) return 0

  const captainId = picks.captain_player_id ?? null
  const supersubApplied = !!picks.supersub_applied_at && picks.supersub_slot === slot

  if (supersubApplied) {
    const outStats = parsePlayerStats(picks.supersub_out_stats) ?? ZERO_STATS
    const inId = pickIdForSlot(picks, slot)
    const inPlayer = inId ? playersById.get(inId) : null
    const baseline = parsePlayerStats(picks.supersub_in_baseline) ?? ZERO_STATS
    const inDelta = inPlayer ? statsDelta(statsFromPlayer(inPlayer), baseline) : ZERO_STATS

    let outPts = playerFantasyPoints(outStats)
    let inPts = playerFantasyPoints(inDelta)

    if (captainId && picks.supersub_out_player_id === captainId) outPts *= 2
    if (captainId && picks.supersub_in_player_id === captainId) inPts *= 2

    return outPts + inPts
  }

  const id = pickIdForSlot(picks, slot)
  if (!id) return 0
  const p = playersById.get(id)
  if (!p) return 0

  let pts = playerFantasyPoints(statsFromPlayer(p))
  if (captainId && id === captainId) pts *= 2
  return pts
}

export function teamFantasyPoints(
  picks: FiveASidePicks | null,
  playersById: Map<string, FiveASidePlayer>
): number {
  if (!picks) return 0
  let total = 0
  for (const slot of SLOT_KEYS) {
    total += slotFantasyPoints(picks, slot, playersById)
  }
  return total
}

export function hasAnyPick(picks: FiveASidePicks | null): boolean {
  if (!picks) return false
  return SLOT_KEYS.some((slot) => !!pickIdForSlot(picks, slot))
}

export function isCaptainLocked(tournamentStarted: boolean): boolean {
  return tournamentStarted
}

export function normalizePlayer(row: Record<string, unknown>): FiveASidePlayer {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    team: String(row.team ?? ""),
    position: String(row.position ?? ""),
    jersey_number: row.jersey_number != null ? Number(row.jersey_number) : null,
    goals: Number(row.goals) || 0,
    assists: Number(row.assists) || 0,
    wins: Number(row.wins) || 0,
    clean_sheets: Number(row.clean_sheets) || 0,
    mvp: Number(row.mvp) || 0,
  }
}

export const FIVE_A_SIDE_PICKS_COLUMNS =
  "gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id, submitted_at, captain_player_id, captain_set_at, supersub_slot, supersub_out_player_id, supersub_in_player_id, supersub_applied_at, supersub_out_stats, supersub_in_baseline"

export const FIVE_A_SIDE_PICKS_SELECT = `user_id, ${FIVE_A_SIDE_PICKS_COLUMNS}`

const FIVE_A_SIDE_PLAYERS_PAGE_SIZE = 1000

/** Supabase caps queries at 1000 rows — paginate so all 48 squads load (Spain, USA, etc.). */
export async function fetchAllFiveASidePlayers<T extends Record<string, unknown> = Record<string, unknown>>(
  supabase: SupabaseClient,
  select: string
): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += FIVE_A_SIDE_PLAYERS_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("five_a_side_players")
      .select(select)
      .order("team")
      .order("name")
      .range(from, from + FIVE_A_SIDE_PLAYERS_PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    if (!data?.length) break
    rows.push(...(data as unknown as T[]))
    if (data.length < FIVE_A_SIDE_PLAYERS_PAGE_SIZE) break
  }
  return rows
}
