import { computeTournamentProgress } from "@/lib/tournament-progress"

type Props = {
  matches: { stage?: string | null; status?: string | null }[]
}

export function TournamentProgressBar({ matches }: Props) {
  const {
    phases,
    currentPhase,
    totalMatches,
    finishedMatches,
    percentComplete,
    tournamentComplete,
  } = computeTournamentProgress(matches)

  if (totalMatches === 0) return null

  return (
    <section
      className="glass rounded-2xl border border-wc-gold/25 p-5 mb-6"
      aria-labelledby="tournament-progress-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 id="tournament-progress-heading" className="text-sm font-bold text-wc-gold uppercase tracking-wider">
          Tournament progress
        </h2>
        <span className="text-xs text-slate-400 tabular-nums">
          {finishedMatches} / {totalMatches} matches
        </span>
      </div>

      <div
        className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall tournament completion"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-wc-gold via-amber-400 to-orange-400 transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {phases.map((phase) => {
          const phasePct = phase.total > 0 ? Math.round((phase.finished / phase.total) * 100) : 0
          const active = phase.inProgress
          const done = phase.complete
          return (
            <div key={phase.id} className="min-w-[3.25rem] flex-1 shrink-0 text-center">
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all ${
                    done ? "bg-emerald-500" : active ? "bg-wc-gold" : "bg-white/20"
                  }`}
                  style={{ width: done ? "100%" : active ? `${Math.max(phasePct, 8)}%` : "0%" }}
                />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                  active ? "text-wc-gold" : done ? "text-emerald-400/90" : "text-slate-500"
                }`}
              >
                {phase.shortLabel}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        {tournamentComplete
          ? "Tournament complete"
          : finishedMatches === 0
            ? `Up next: ${currentPhase.label}`
            : `Currently: ${currentPhase.label}`}
      </p>
    </section>
  )
}
