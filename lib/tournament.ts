/** True once the earliest World Cup match kickoff has passed. */
export function isTournamentStarted(firstKickoffIso: string | null | undefined): boolean {
  if (!firstKickoffIso) return false
  return new Date() >= new Date(firstKickoffIso)
}

export function playerProfilePath(userId: string): string {
  return `/player/${userId}`
}
