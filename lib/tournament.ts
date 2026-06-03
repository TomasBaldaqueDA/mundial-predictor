import type { SupabaseClient } from "@supabase/supabase-js"

/** True once the earliest World Cup match kickoff has passed. */
export function isTournamentStarted(firstKickoffIso: string | null | undefined): boolean {
  if (!firstKickoffIso) return false
  return new Date() >= new Date(firstKickoffIso)
}

export async function fetchTournamentStarted(supabase: SupabaseClient): Promise<boolean> {
  const { data } = await supabase
    .from("matches")
    .select("kickoff_time")
    .order("kickoff_time", { ascending: true })
    .limit(1)
    .maybeSingle()
  return isTournamentStarted(data?.kickoff_time as string | undefined)
}

export function playerProfilePath(userId: string): string {
  return `/player/${userId}`
}
