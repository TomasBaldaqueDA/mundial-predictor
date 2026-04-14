import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { GamesList } from "./GamesList"

export default async function JogosPage() {
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_time", { ascending: true })

  const allMatches = matches ?? []
  const now = new Date()

  // Show all future matches (any stage) so knockout stages are visible for testing
  const upcoming = allMatches.filter((m) => new Date(m.kickoff_time) >= now)
  const past = allMatches
    .filter((m) => new Date(m.kickoff_time) < now)
    .reverse()

  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)] mb-8">Games</h1>
      <Suspense fallback={<p className="text-white/50 text-sm">Loading games…</p>}>
        <GamesList upcoming={upcoming} past={past} />
      </Suspense>
    </main>
  )
}
