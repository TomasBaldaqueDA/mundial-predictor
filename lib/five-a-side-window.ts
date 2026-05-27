import { buildPowerUpBucketMap, type MatchForBucket } from "@/lib/powerup-bucket"

export type MatchForSupersubWindow = MatchForBucket & {
  status?: string | null
}

export type SupersubLockCode =
  | "open"
  | "team_incomplete"
  | "before_third_round"
  | "after_round_of_32"
  | "already_applied"
  | "no_schedule"

export type SupersubButtonState = {
  canUse: boolean
  lockCode: SupersubLockCode
  lockReason: string | null
}

const LOCK_MESSAGES: Record<Exclude<SupersubLockCode, "open">, string> = {
  team_incomplete: "Complete your 5-player team first.",
  before_third_round: "Unlocks after all group stage round 3 matches finish.",
  after_round_of_32: "Round of 32 has started — supersub is locked.",
  already_applied: "You already used your supersub for this tournament.",
  no_schedule: "Tournament schedule not loaded yet.",
}

/** UI + actions: when the supersub button is enabled and why it is locked otherwise. */
export function getSupersubButtonState(
  matches: MatchForSupersubWindow[],
  options: { teamComplete: boolean; supersubApplied: boolean },
  now: Date = new Date()
): SupersubButtonState {
  if (options.supersubApplied) {
    return { canUse: false, lockCode: "already_applied", lockReason: LOCK_MESSAGES.already_applied }
  }
  if (!options.teamComplete) {
    return { canUse: false, lockCode: "team_incomplete", lockReason: LOCK_MESSAGES.team_incomplete }
  }
  if (matches.length === 0) {
    return { canUse: false, lockCode: "no_schedule", lockReason: LOCK_MESSAGES.no_schedule }
  }

  const bucketMap = buildPowerUpBucketMap(matches)
  const thirdRound = matches.filter((m) => bucketMap.get(m.id) === "3rd Round")
  if (thirdRound.length === 0 || !thirdRound.every((m) => m.status === "finished")) {
    return { canUse: false, lockCode: "before_third_round", lockReason: LOCK_MESSAGES.before_third_round }
  }

  const r32 = matches
    .filter((m) => m.stage === "Round of 32")
    .sort((a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime())

  if (r32.length > 0 && now.getTime() >= new Date(r32[0]!.kickoff_time).getTime()) {
    return { canUse: false, lockCode: "after_round_of_32", lockReason: LOCK_MESSAGES.after_round_of_32 }
  }

  return { canUse: true, lockCode: "open", lockReason: null }
}

/** True after every group-stage 3rd-round match is finished and before Round of 32 kickoff. */
export function isSupersubWindowOpen(matches: MatchForSupersubWindow[], now: Date = new Date()): boolean {
  return getSupersubButtonState(
    matches,
    { teamComplete: true, supersubApplied: false },
    now
  ).canUse
}
