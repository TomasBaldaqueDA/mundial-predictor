import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/app/components/PageHeader"
import { TournamentProgressBar } from "@/app/components/TournamentProgressBar"
import { ListSkeleton } from "@/app/components/Skeleton"
import { GamesList, type InitialPredictionData } from "./GamesList"

export const metadata = {
  title: "Games",
  description: "Every match of the 2026 World Cup with predictions and live results.",
}

export default async function JogosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: matches }, predictionsResult] = await Promise.all([
    supabase.from("matches").select("*").order("kickoff_time", { ascending: true }),
    user
      ? supabase
          .from("predictions")
          .select("id, match_id, pred_score1, pred_score2, pred_mvp, pred_qualifier, points, points_multiplier")
          .eq("user_id", user.id)
      : Promise.resolve({ data: null }),
  ])

  let initialPredictionData: InitialPredictionData | null = null
  if (user && predictionsResult.data) {
    const matchIds: number[] = []
    const predictions: InitialPredictionData["predictions"] = {}
    const rowIds: InitialPredictionData["rowIds"] = {}
    for (const row of predictionsResult.data) {
      const mid = row.match_id as number
      matchIds.push(mid)
      rowIds[mid] = row.id as number
      predictions[mid] = {
        pred_score1: row.pred_score1 ?? 0,
        pred_score2: row.pred_score2 ?? 0,
        pred_mvp: row.pred_mvp ?? null,
        pred_qualifier: row.pred_qualifier ?? null,
        points: row.points ?? null,
        points_multiplier: row.points_multiplier ?? null,
      }
    }
    initialPredictionData = { matchIds, predictions, rowIds }
  }

  const allMatches = matches ?? []
  const now = new Date()

  const upcoming = allMatches.filter((m) => m.status === "started" || new Date(m.kickoff_time) >= now)
  const past = allMatches
    .filter((m) => m.status !== "started" && new Date(m.kickoff_time) < now)
    .reverse()

  return (
    <main>
      <PageHeader
        title="Games"
        description="Every match of the 2026 World Cup — predict scores, MVPs and qualifiers before kickoff."
      />
      <TournamentProgressBar matches={allMatches} />
      <Suspense fallback={<ListSkeleton rows={8} />}>
        <GamesList upcoming={upcoming} past={past} initialPredictionData={initialPredictionData} />
      </Suspense>
    </main>
  )
}
