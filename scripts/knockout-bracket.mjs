/**
 * Maps internal match IDs (insert order in 007) to FIFA knockout slots.
 * R32 insert order ≠ FIFA match numbers for several fixtures.
 *
 * When a Round of 32 match finishes, use getR16Slot(internalMatchId) for bracket updates.
 */

/** @type {Record<number, number>} internal R32 id → FIFA match number */
export const INTERNAL_TO_FIFA = {
  73: 73,
  74: 76,
  75: 74,
  76: 75,
  77: 78,
  78: 77,
  79: 79,
  80: 80,
  81: 81,
  82: 82,
  83: 84,
  84: 83,
  85: 85,
  86: 88,
  87: 86,
  88: 87,
}

/** @type {Record<number, { matchId: number, slot: "team1" | "team2" }>} FIFA W# → R16 slot */
const FIFA_WINNER_TO_R16 = {
  73: { matchId: 90, slot: "team1" },
  74: { matchId: 89, slot: "team1" },
  75: { matchId: 90, slot: "team2" },
  76: { matchId: 91, slot: "team1" },
  77: { matchId: 89, slot: "team2" },
  78: { matchId: 91, slot: "team2" },
  79: { matchId: 92, slot: "team1" },
  80: { matchId: 92, slot: "team2" },
  81: { matchId: 94, slot: "team1" },
  82: { matchId: 94, slot: "team2" },
  83: { matchId: 93, slot: "team1" },
  84: { matchId: 93, slot: "team2" },
  85: { matchId: 96, slot: "team1" },
  86: { matchId: 95, slot: "team1" },
  87: { matchId: 96, slot: "team2" },
  88: { matchId: 95, slot: "team2" },
}

/** @param {number} internalMatchId finished R32 match id (73–88) */
export function getR16Slot(internalMatchId) {
  const fifaId = INTERNAL_TO_FIFA[internalMatchId]
  if (!fifaId) return null
  return FIFA_WINNER_TO_R16[fifaId] ?? null
}

/** @param {number} internalMatchId @param {string} winnerTeam */
export function formatBracketArg(internalMatchId, winnerTeam) {
  const slot = getR16Slot(internalMatchId)
  if (!slot) return null
  return `${slot.matchId}:${slot.slot}:${winnerTeam}`
}
