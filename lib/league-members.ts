import type { SupabaseClient } from "@supabase/supabase-js"

/** When `leagueId` is set, returns member user ids (may be empty). When unset, returns null = no filter. */
export async function getLeagueMemberIds(
  supabase: SupabaseClient,
  leagueId: string
): Promise<Set<string> | null> {
  if (!leagueId) return null
  const { data: members } = await supabase
    .from("private_league_members")
    .select("user_id")
    .eq("league_id", leagueId)
  return new Set((members ?? []).map((m: { user_id: string }) => m.user_id))
}

export function isUserInLeagueFilter(
  leagueMemberIds: Set<string> | null,
  userId: string | null | undefined
): boolean {
  if (!leagueMemberIds) return true
  if (!userId) return false
  return leagueMemberIds.has(userId)
}
