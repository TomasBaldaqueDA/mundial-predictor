import { Suspense } from "react"
import { LeagueFilter } from "@/app/components/LeagueFilter"

type Props = {
  title: string
  currentLeagueId?: string
}

export function LeagueFilterBar({ title, currentLeagueId }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <Suspense fallback={<div className="h-8 w-32 rounded-xl bg-white/5 animate-pulse" aria-hidden />}>
        <LeagueFilter currentLeagueId={currentLeagueId} />
      </Suspense>
    </div>
  )
}
