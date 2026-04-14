/** Same buckets as `validatePowerUpPhase` — sync helper for UI locking. */

export type PowerUpBucket =
  | "1st Round"
  | "2nd Round"
  | "3rd Round"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Final phase"
  | "Other"

export type MatchForBucket = {
  id: number
  stage?: string | null
  group?: string | null
  kickoff_time: string
}

export function buildPowerUpBucketMap(matches: MatchForBucket[]): Map<number, PowerUpBucket> {
  const map = new Map<number, PowerUpBucket>()
  const byGroup = new Map<string, MatchForBucket[]>()

  for (const m of matches) {
    if (m.stage === "First Stage" && m.group) {
      const g = m.group
      if (!byGroup.has(g)) byGroup.set(g, [])
      byGroup.get(g)!.push(m)
    }
  }

  for (const arr of byGroup.values()) {
    arr.sort((a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime())
    arr.forEach((m, idx) => {
      if (idx <= 1) map.set(m.id, "1st Round")
      else if (idx <= 3) map.set(m.id, "2nd Round")
      else map.set(m.id, "3rd Round")
    })
  }

  for (const m of matches) {
    if (map.has(m.id)) continue
    const stage = m.stage ?? ""
    if (stage === "Play-off for third place" || stage === "Final") map.set(m.id, "Final phase")
    else if (stage === "Round of 32") map.set(m.id, "Round of 32")
    else if (stage === "Round of 16") map.set(m.id, "Round of 16")
    else if (stage === "Quarter-final") map.set(m.id, "Quarter-final")
    else if (stage === "Semi-final") map.set(m.id, "Semi-final")
    else map.set(m.id, "Other")
  }

  return map
}
