export type FiveASidePlayer = {
  id: string
  name: string
  team: string
  position: string
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

export function playerFantasyPoints(p: Pick<FiveASidePlayer, "goals" | "assists" | "mvp" | "wins" | "clean_sheets">): number {
  return (
    p.goals * FIVE_A_SIDE_PTS.GOAL +
    p.assists * FIVE_A_SIDE_PTS.ASSIST +
    p.mvp * FIVE_A_SIDE_PTS.MVP +
    p.wins * FIVE_A_SIDE_PTS.WIN +
    p.clean_sheets * FIVE_A_SIDE_PTS.CLEAN_SHEET
  )
}

export function teamFantasyPoints(
  picks: FiveASidePicks | null,
  playersById: Map<string, FiveASidePlayer>
): number {
  if (!picks) return 0
  let total = 0
  for (const slot of SLOT_KEYS) {
    const id = pickIdForSlot(picks, slot)
    if (!id) continue
    const p = playersById.get(id)
    if (p) total += playerFantasyPoints(p)
  }
  return total
}

export function hasAnyPick(picks: FiveASidePicks | null): boolean {
  if (!picks) return false
  return SLOT_KEYS.some((slot) => !!pickIdForSlot(picks, slot))
}

export function normalizePlayer(row: Record<string, unknown>): FiveASidePlayer {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    team: String(row.team ?? ""),
    position: String(row.position ?? ""),
    goals: Number(row.goals) || 0,
    assists: Number(row.assists) || 0,
    wins: Number(row.wins) || 0,
    clean_sheets: Number(row.clean_sheets) || 0,
    mvp: Number(row.mvp) || 0,
  }
}
