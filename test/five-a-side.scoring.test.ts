import { describe, expect, it } from "vitest"
import {
  playerFantasyPoints,
  slotFantasyPoints,
  statsFromPlayer,
  teamFantasyPoints,
  type FiveASidePicks,
  type FiveASidePlayer,
} from "@/lib/five-a-side"
import { getSupersubButtonState, isSupersubWindowOpen } from "@/lib/five-a-side-window"

const mkPlayer = (id: string, stats: Partial<FiveASidePlayer> = {}): FiveASidePlayer => ({
  id,
  name: id,
  team: "Team",
  position: "md",
  goals: 0,
  assists: 0,
  wins: 0,
  clean_sheets: 0,
  mvp: 0,
  ...stats,
})

describe("five-a-side scoring", () => {
  it("doubles captain points", () => {
    const players = new Map([
      ["p1", mkPlayer("p1", { goals: 1, position: "st" })],
      ["p2", mkPlayer("p2", { position: "gk" })],
      ["p3", mkPlayer("p3", { position: "df" })],
      ["p4", mkPlayer("p4", { position: "md" })],
      ["p5", mkPlayer("p5", { position: "md" })],
    ])
    const picks: FiveASidePicks = {
      gk_player_id: "p2",
      df_player_id: "p3",
      md1_player_id: "p4",
      md2_player_id: "p5",
      st_player_id: "p1",
      captain_player_id: "p1",
    }
    expect(teamFantasyPoints(picks, players)).toBe(8)
  })

  it("splits supersub slot between frozen out stats and incoming delta", () => {
    const players = new Map([
      ["out", mkPlayer("out", { goals: 3, position: "st" })],
      ["in", mkPlayer("in", { goals: 5, position: "st" })],
      ["p2", mkPlayer("p2", { position: "gk" })],
      ["p3", mkPlayer("p3", { position: "df" })],
      ["p4", mkPlayer("p4", { position: "md" })],
    ])
    const picks: FiveASidePicks = {
      gk_player_id: "p2",
      df_player_id: "p3",
      md1_player_id: "p4",
      md2_player_id: "p4",
      st_player_id: "in",
      supersub_slot: "st",
      supersub_out_player_id: "out",
      supersub_in_player_id: "in",
      supersub_applied_at: "2026-06-20T00:00:00.000Z",
      supersub_out_stats: statsFromPlayer(mkPlayer("out", { goals: 2, position: "st" })),
      supersub_in_baseline: statsFromPlayer(mkPlayer("in", { goals: 1, position: "st" })),
    }
    const stPts = slotFantasyPoints(picks, "st", players)
    expect(stPts).toBe(playerFantasyPoints({ goals: 2, assists: 0, mvp: 0, wins: 0, clean_sheets: 0 }) + 4 * 4)
  })

  it("doubles supersub out portion when captain was subbed out", () => {
    const players = new Map([
      ["out", mkPlayer("out", { goals: 1, position: "st" })],
      ["in", mkPlayer("in", { goals: 2, position: "st" })],
      ["p2", mkPlayer("p2", { position: "gk" })],
      ["p3", mkPlayer("p3", { position: "df" })],
      ["p4", mkPlayer("p4", { position: "md" })],
    ])
    const picks: FiveASidePicks = {
      gk_player_id: "p2",
      df_player_id: "p3",
      md1_player_id: "p4",
      md2_player_id: "p4",
      st_player_id: "in",
      captain_player_id: "out",
      supersub_slot: "st",
      supersub_out_player_id: "out",
      supersub_in_player_id: "in",
      supersub_applied_at: "2026-06-20T00:00:00.000Z",
      supersub_out_stats: statsFromPlayer(mkPlayer("out", { goals: 1, position: "st" })),
      supersub_in_baseline: statsFromPlayer(mkPlayer("in", { goals: 0, position: "st" })),
    }
    expect(slotFantasyPoints(picks, "st", players)).toBe(4 * 2 + 4 * 2)
  })
})

describe("getSupersubButtonState", () => {
  const finishedThirdRoundMatches = [
    { id: 1, stage: "First Stage", group: "A", kickoff_time: "2026-06-01T12:00:00.000Z", status: "finished" },
    { id: 2, stage: "First Stage", group: "A", kickoff_time: "2026-06-02T12:00:00.000Z", status: "finished" },
    { id: 3, stage: "First Stage", group: "A", kickoff_time: "2026-06-03T12:00:00.000Z", status: "finished" },
    { id: 4, stage: "First Stage", group: "A", kickoff_time: "2026-06-04T12:00:00.000Z", status: "finished" },
    { id: 5, stage: "First Stage", group: "A", kickoff_time: "2026-06-05T12:00:00.000Z", status: "finished" },
    { id: 6, stage: "Round of 32", kickoff_time: "2026-07-01T12:00:00.000Z", status: "scheduled" },
  ]

  it("locks before round 3 is complete", () => {
    const matches = finishedThirdRoundMatches.map((m, i) =>
      i === 4 ? { ...m, status: "scheduled" } : m
    )
    const state = getSupersubButtonState(
      matches,
      { teamComplete: true, supersubApplied: false },
      new Date("2026-06-20T00:00:00.000Z")
    )
    expect(state.canUse).toBe(false)
    expect(state.lockCode).toBe("before_third_round")
  })

  it("opens between round 3 end and R32", () => {
    const state = getSupersubButtonState(
      finishedThirdRoundMatches,
      { teamComplete: true, supersubApplied: false },
      new Date("2026-06-20T00:00:00.000Z")
    )
    expect(state.canUse).toBe(true)
    expect(state.lockCode).toBe("open")
  })

  it("locks after round of 32 starts", () => {
    const state = getSupersubButtonState(
      finishedThirdRoundMatches,
      { teamComplete: true, supersubApplied: false },
      new Date("2026-07-02T00:00:00.000Z")
    )
    expect(state.canUse).toBe(false)
    expect(state.lockCode).toBe("after_round_of_32")
  })
})

describe("isSupersubWindowOpen", () => {
  it("is open after all 3rd-round group matches finish and before R32", () => {
    const matches = [
      { id: 1, stage: "First Stage", group: "A", kickoff_time: "2026-06-01T12:00:00.000Z", status: "finished" },
      { id: 2, stage: "First Stage", group: "A", kickoff_time: "2026-06-02T12:00:00.000Z", status: "finished" },
      { id: 3, stage: "First Stage", group: "A", kickoff_time: "2026-06-03T12:00:00.000Z", status: "finished" },
      { id: 4, stage: "First Stage", group: "A", kickoff_time: "2026-06-04T12:00:00.000Z", status: "finished" },
      { id: 5, stage: "First Stage", group: "A", kickoff_time: "2026-06-05T12:00:00.000Z", status: "finished" },
      { id: 6, stage: "Round of 32", kickoff_time: "2026-07-01T12:00:00.000Z", status: "scheduled" },
    ]
    expect(isSupersubWindowOpen(matches, new Date("2026-06-20T00:00:00.000Z"))).toBe(true)
  })

  it("is closed once Round of 32 has kicked off", () => {
    const matches = [
      { id: 1, stage: "First Stage", group: "A", kickoff_time: "2026-06-01T12:00:00.000Z", status: "finished" },
      { id: 2, stage: "First Stage", group: "A", kickoff_time: "2026-06-02T12:00:00.000Z", status: "finished" },
      { id: 3, stage: "First Stage", group: "A", kickoff_time: "2026-06-03T12:00:00.000Z", status: "finished" },
      { id: 4, stage: "First Stage", group: "A", kickoff_time: "2026-06-04T12:00:00.000Z", status: "finished" },
      { id: 5, stage: "First Stage", group: "A", kickoff_time: "2026-06-05T12:00:00.000Z", status: "finished" },
      { id: 6, stage: "Round of 32", kickoff_time: "2026-07-01T12:00:00.000Z", status: "finished" },
    ]
    expect(isSupersubWindowOpen(matches, new Date("2026-07-02T00:00:00.000Z"))).toBe(false)
  })
})
