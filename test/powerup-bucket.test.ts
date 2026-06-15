import { describe, expect, it } from "vitest"
import { buildPowerUpBucketMap, filterMatchesByGroupRound } from "@/lib/powerup-bucket"

describe("filterMatchesByGroupRound", () => {
  const all = [
    { id: 1, stage: "First Stage", group: "A", kickoff_time: "2026-06-11 20:00:00" },
    { id: 2, stage: "First Stage", group: "A", kickoff_time: "2026-06-12 03:00:00" },
    { id: 3, stage: "First Stage", group: "A", kickoff_time: "2026-06-18 17:00:00" },
    { id: 4, stage: "First Stage", group: "A", kickoff_time: "2026-06-19 02:00:00" },
    { id: 5, stage: "First Stage", group: "A", kickoff_time: "2026-06-25 02:00:00" },
    { id: 6, stage: "First Stage", group: "A", kickoff_time: "2026-06-25 02:00:00" },
  ]

  it("assigns 2 games per round per group", () => {
    const map = buildPowerUpBucketMap(all)
    expect(map.get(1)).toBe("1st Round")
    expect(map.get(2)).toBe("1st Round")
    expect(map.get(3)).toBe("2nd Round")
    expect(map.get(4)).toBe("2nd Round")
    expect(map.get(5)).toBe("3rd Round")
    expect(map.get(6)).toBe("3rd Round")
  })

  it("keeps correct round when filtering only upcoming subset", () => {
    const upcomingOnly = all.filter((m) => m.id >= 3)
    const secondRound = filterMatchesByGroupRound(upcomingOnly, all, "2nd Round")
    expect(secondRound.map((m) => m.id)).toEqual([3, 4])
    expect(secondRound.some((m) => m.id === 5)).toBe(false)
  })

  it("does not mis-label round 3 games as round 2 in upcoming-only list", () => {
    const upcomingOnly = all.filter((m) => m.id >= 4)
    const secondRound = filterMatchesByGroupRound(upcomingOnly, all, "2nd Round")
    expect(secondRound.map((m) => m.id)).toEqual([4])
  })
})
