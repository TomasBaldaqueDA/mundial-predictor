import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/app/components/PageHeader"
import { GamesList } from "./GamesList"

export const metadata = {
  title: "Games",
  description: "Every match of the 2026 World Cup with predictions and live results.",
}

export default async function JogosPage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_time", { ascending: true })

  const allMatches = matches ?? []
  const now = new Date()

  // Keep live matches in the active list even after kickoff time has passed.
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
      <Suspense fallback={<p className="text-white/50 text-sm">Loading games…</p>}>
        <GamesList upcoming={upcoming} past={past} />
      </Suspense>
    </main>
  )
}
