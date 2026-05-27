import { buildPowerUpBucketMap, type MatchForBucket } from "@/lib/powerup-bucket"

export type MatchForSupersubWindow = MatchForBucket & {
  status?: string | null
}

/** True after every group-stage 3rd-round match is finished and before Round of 32 kickoff. */
export function isSupersubWindowOpen(matches: MatchForSupersubWindow[], now: Date = new Date()): boolean {
  if (matches.length === 0) return false

  const bucketMap = buildPowerUpBucketMap(matches)
  const thirdRound = matches.filter((m) => bucketMap.get(m.id) === "3rd Round")
  if (thirdRound.length === 0) return false
  if (!thirdRound.every((m) => m.status === "finished")) return false

  const r32 = matches
    .filter((m) => m.stage === "Round of 32")
    .sort((a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime())

  if (r32.length === 0) return true

  return now.getTime() < new Date(r32[0]!.kickoff_time).getTime()
}
