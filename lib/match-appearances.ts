import matchAppearancesData from "@/data/match-appearances.json"

export type MatchAppearanceEntry = {
  matchId: number
  team1: string
  team2: string
  score1: number
  score2: number
  mvp: { team: string; name: string }
  appearances: Record<string, string[]>
}

export const MATCH_APPEARANCES = matchAppearancesData as unknown as MatchAppearanceEntry[]

/** GP per player from recorded lineups (starters + subs who entered). */
export function gamesPlayedLookup(): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of MATCH_APPEARANCES) {
    for (const [team, names] of Object.entries(match.appearances)) {
      for (const name of names) {
        const key = `${team}|${name}`
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
  }
  return counts
}

export function resolveGamesPlayed(team: string, name: string, dbValue?: number | null): number {
  const fromDb = Number(dbValue) || 0
  const fromLineups = gamesPlayedLookup().get(`${team}|${name}`) ?? 0
  return Math.max(fromDb, fromLineups)
}
