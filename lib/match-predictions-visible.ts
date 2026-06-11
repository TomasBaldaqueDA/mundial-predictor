import { getKickoffTimestamp } from "@/lib/format-kickoff"

type MatchLike = {
  kickoff_time: string
  status?: string | null
  score1?: number | null
  score2?: number | null
}

/** True once kickoff has passed, the match is live/finished, or a result exists. */
export function shouldShowMatchPredictionsList(
  match: MatchLike,
  nowMs: number = Date.now()
): boolean {
  const kickoffMs = getKickoffTimestamp(String(match.kickoff_time))
  const hasResult = match.score1 != null && match.score2 != null
  const hasStarted = !Number.isNaN(kickoffMs) && nowMs >= kickoffMs
  const status = match.status ?? ""
  return hasStarted || hasResult || status === "started" || status === "finished"
}
