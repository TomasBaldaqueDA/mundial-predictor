import { describe, expect, it } from "vitest"
import { calculateMatchPoints } from "@/lib/points"

describe("calculateMatchPoints", () => {
  const finished = { score1: 2, score2: 1, mvp: "Player A", qualifier: "Team A" }

  it("returns 0 when match is not finished", () => {
    expect(
      calculateMatchPoints(
        { score1: null, score2: null, mvp: null },
        { pred_score1: 1, pred_score2: 0, pred_mvp: "X" }
      )
    ).toBe(0)
  })

  it("awards 3 for exact score only", () => {
    expect(
      calculateMatchPoints(finished, {
        pred_score1: 2,
        pred_score2: 1,
        pred_mvp: "Wrong",
      })
    ).toBe(3)
  })

  it("awards 1 for correct winner when not exact", () => {
    expect(
      calculateMatchPoints(finished, {
        pred_score1: 3,
        pred_score2: 1,
        pred_mvp: "Wrong",
      })
    ).toBe(1)
  })

  it("awards 1 for correct MVP when score wrong", () => {
    expect(
      calculateMatchPoints(finished, {
        pred_score1: 0,
        pred_score2: 0,
        pred_mvp: "Player A",
      })
    ).toBe(1)
  })

  it("awards combo +1 for exact score and MVP", () => {
    expect(
      calculateMatchPoints(finished, {
        pred_score1: 2,
        pred_score2: 1,
        pred_mvp: "player a",
      })
    ).toBe(5)
  })

  it("awards +1 for correct knockout qualifier", () => {
    expect(
      calculateMatchPoints(finished, {
        pred_score1: 0,
        pred_score2: 0,
        pred_mvp: "Wrong",
        pred_qualifier: "team a",
      })
    ).toBe(1)
  })

  it("doubles total with ×2 multiplier", () => {
    expect(
      calculateMatchPoints(
        finished,
        { pred_score1: 2, pred_score2: 1, pred_mvp: "Player A", pred_qualifier: "Team A" },
        { points_multiplier: 2 }
      )
    ).toBe(12)
  })
})
