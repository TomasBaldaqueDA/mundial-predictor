export const TOURNAMENT_PHASES = [
  { id: "groups", label: "Group stage", shortLabel: "Groups", stages: ["First Stage"] },
  { id: "r32", label: "Round of 32", shortLabel: "R32", stages: ["Round of 32"] },
  { id: "r16", label: "Round of 16", shortLabel: "R16", stages: ["Round of 16"] },
  { id: "qf", label: "Quarter-finals", shortLabel: "QF", stages: ["Quarter-final"] },
  { id: "sf", label: "Semi-finals", shortLabel: "SF", stages: ["Semi-final"] },
  { id: "final", label: "Final", shortLabel: "Final", stages: ["Play-off for third place", "Final"] },
] as const

export type TournamentPhaseProgress = {
  id: string
  label: string
  shortLabel: string
  total: number
  finished: number
  complete: boolean
  inProgress: boolean
}

export type TournamentProgress = {
  phases: TournamentPhaseProgress[]
  currentPhase: TournamentPhaseProgress
  totalMatches: number
  finishedMatches: number
  percentComplete: number
  tournamentComplete: boolean
}

function isFinished(status: string | null | undefined): boolean {
  return status === "finished"
}

export function computeTournamentProgress(
  matches: { stage?: string | null; status?: string | null }[]
): TournamentProgress {
  const phases: TournamentPhaseProgress[] = TOURNAMENT_PHASES.map((phase) => {
    const phaseMatches = matches.filter((m) =>
      (phase.stages as readonly string[]).includes(m.stage ?? "")
    )
    const total = phaseMatches.length
    const finished = phaseMatches.filter((m) => isFinished(m.status)).length
    return {
      id: phase.id,
      label: phase.label,
      shortLabel: phase.shortLabel,
      total,
      finished,
      complete: total > 0 && finished >= total,
      inProgress: false,
    }
  })

  let currentIndex = 0
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].total === 0) continue
    if (!phases[i].complete) {
      currentIndex = i
      phases[i].inProgress = true
      break
    }
    currentIndex = i
  }

  const totalMatches = matches.length
  const finishedMatches = matches.filter((m) => isFinished(m.status)).length
  const percentComplete = totalMatches > 0 ? Math.round((finishedMatches / totalMatches) * 100) : 0
  const tournamentComplete = totalMatches > 0 && finishedMatches >= totalMatches

  if (tournamentComplete) {
    for (const p of phases) p.inProgress = false
  }

  return {
    phases,
    currentPhase: phases[currentIndex] ?? phases[0]!,
    totalMatches,
    finishedMatches,
    percentComplete,
    tournamentComplete,
  }
}
