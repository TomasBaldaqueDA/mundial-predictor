import { describe, expect, it } from "vitest"
import { computeTournamentProgress } from "@/lib/tournament-progress"

describe("computeTournamentProgress", () => {
  it("starts at group stage when no matches finished", () => {
    const progress = computeTournamentProgress([
      { stage: "First Stage", status: "scheduled" },
      { stage: "Round of 32", status: "scheduled" },
    ])
    expect(progress.finishedMatches).toBe(0)
    expect(progress.currentPhase.id).toBe("groups")
    expect(progress.phases[0]?.inProgress).toBe(true)
  })

  it("advances to knockout after group stage completes", () => {
    const progress = computeTournamentProgress([
      { stage: "First Stage", status: "finished" },
      { stage: "First Stage", status: "finished" },
      { stage: "Round of 32", status: "scheduled" },
    ])
    expect(progress.currentPhase.id).toBe("r32")
    expect(progress.phases[0]?.complete).toBe(true)
  })

  it("marks tournament complete when all matches finished", () => {
    const progress = computeTournamentProgress([
      { stage: "First Stage", status: "finished" },
      { stage: "Final", status: "finished" },
    ])
    expect(progress.tournamentComplete).toBe(true)
    expect(progress.percentComplete).toBe(100)
  })
})
