import manifest from "@/data/league-kante-cartoon-cards.json"

const CARD_BASE = "/5aside_cards"

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

const cardByTeamAndName = new Map<string, string>()

for (const entry of manifest.players) {
  if (entry.status !== "done" || !entry.file) continue
  const key = `${norm(entry.team)}|${norm(entry.name)}`
  cardByTeamAndName.set(key, `${CARD_BASE}/${entry.file}`)
}

/** Public URL for a 5-a-side cartoon card, or null when no card exists for this player. */
export function getFiveASideCardSrc(team: string, name: string): string | null {
  return cardByTeamAndName.get(`${norm(team)}|${norm(name)}`) ?? null
}

export function hasFiveASideCard(team: string, name: string): boolean {
  return getFiveASideCardSrc(team, name) !== null
}
