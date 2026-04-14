import type { SupabaseClient } from "@supabase/supabase-js"

type MatchLite = {
  id: number
  stage?: string | null
  group?: string | null
  kickoff_time: string
}

type PowerUpBucket =
  | "1st Round"
  | "2nd Round"
  | "3rd Round"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Final phase"
  | "Other"

async function getBucketForMatch(
  supabase: SupabaseClient,
  match: MatchLite,
  groupCache: Map<string, number[]>
): Promise<PowerUpBucket> {
  const stage = match.stage ?? ""
  if (stage === "First Stage" && match.group) {
    let ids = groupCache.get(match.group)
    if (!ids) {
      const { data: groupRows } = await supabase
        .from("matches")
        .select("id, kickoff_time")
        .eq("stage", "First Stage")
        .eq("group", match.group)
        .order("kickoff_time", { ascending: true })
      ids = (groupRows ?? []).map((r) => r.id as number)
      groupCache.set(match.group, ids)
    }
    const idx = ids.indexOf(match.id)
    if (idx < 0) return "Other"
    if (idx <= 1) return "1st Round"
    if (idx <= 3) return "2nd Round"
    return "3rd Round"
  }
  if (stage === "Play-off for third place" || stage === "Final") return "Final phase"
  if (stage === "Round of 32") return "Round of 32"
  if (stage === "Round of 16") return "Round of 16"
  if (stage === "Quarter-final") return "Quarter-final"
  if (stage === "Semi-final") return "Semi-final"
  return "Other"
}

export async function validatePowerUpPhase(
  supabase: SupabaseClient,
  opts: {
    userId: string
    targetMatch: MatchLite
    enable: boolean
    excludePredictionId?: number | null
  }
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!opts.enable) return { ok: true }
  const groupCache = new Map<string, number[]>()
  const targetBucket = await getBucketForMatch(supabase, opts.targetMatch, groupCache)
  if (targetBucket === "Other") return { ok: true }

  const { data: boosted } = await supabase
    .from("predictions")
    .select("id, match_id")
    .eq("user_id", opts.userId)
    .eq("points_multiplier", 2)

  const others = (boosted ?? []).filter((p) => p.id !== opts.excludePredictionId)
  if (!others.length) return { ok: true }

  const { data: mrows } = await supabase
    .from("matches")
    .select("id, stage, group, kickoff_time")
    .in(
      "id",
      others.map((p) => p.match_id)
    )

  for (const m of mrows ?? []) {
    const b = await getBucketForMatch(
      supabase,
      {
        id: Number(m.id),
        stage: m.stage ?? null,
        group: m.group ?? null,
        kickoff_time: m.kickoff_time,
      },
      groupCache
    )
    if (b === targetBucket) {
      return {
        ok: false,
        message: `You already used ×2 in ${targetBucket}. Only one ×2 per phase is allowed.`,
      }
    }
  }
  return { ok: true }
}
