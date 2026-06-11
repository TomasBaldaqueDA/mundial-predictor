import { describe, expect, it } from "vitest"
import { shouldShowMatchPredictionsList } from "@/lib/match-predictions-visible"

const KICKOFF = "2026-06-11T19:00:00.000Z"

describe("shouldShowMatchPredictionsList", () => {
  it("is false before kickoff for a scheduled match", () => {
    expect(
      shouldShowMatchPredictionsList(
        { kickoff_time: KICKOFF, status: "scheduled", score1: null, score2: null },
        Date.parse("2026-06-11T18:59:59.000Z")
      )
    ).toBe(false)
  })

  it("is true after kickoff", () => {
    expect(
      shouldShowMatchPredictionsList(
        { kickoff_time: KICKOFF, status: "scheduled", score1: null, score2: null },
        Date.parse("2026-06-11T19:00:00.000Z")
      )
    ).toBe(true)
  })

  it("is true when live even if kickoff timestamp is still in the future", () => {
    expect(
      shouldShowMatchPredictionsList(
        { kickoff_time: KICKOFF, status: "started", score1: null, score2: null },
        Date.parse("2026-06-11T18:00:00.000Z")
      )
    ).toBe(true)
  })

  it("is true when a result exists", () => {
    expect(
      shouldShowMatchPredictionsList(
        { kickoff_time: KICKOFF, status: "finished", score1: 2, score2: 1 },
        Date.parse("2026-06-11T18:00:00.000Z")
      )
    ).toBe(true)
  })
})
