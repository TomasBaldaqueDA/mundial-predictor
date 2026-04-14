import { TEAM_FLAG_CODES } from "@/lib/team-flags"

/** Approximate home-kit colours for shirt back (no logos). */
export type KitPattern = "solid" | "vertical" | "split" | "argentina"

export type KitStyle = {
  primary: string
  secondary: string
  /** Collar / trim */
  accent?: string
  pattern: KitPattern
}

const DEFAULT_KIT: KitStyle = {
  primary: "#475569",
  secondary: "#1e293b",
  accent: "#94a3b8",
  pattern: "solid",
}

/** Per national team — stylised only, not official kit designs. */
export const TEAM_KITS: Record<string, KitStyle> = {
  Mexico: { primary: "#006847", secondary: "#CE1126", accent: "#FFFFFF", pattern: "vertical" },
  "South Africa": { primary: "#007749", secondary: "#FCB514", accent: "#FFFFFF", pattern: "vertical" },
  "Korea Republic": { primary: "#C60C30", secondary: "#003478", accent: "#FFFFFF", pattern: "vertical" },
  Czechia: { primary: "#D7141A", secondary: "#11457E", accent: "#FFFFFF", pattern: "vertical" },
  Canada: { primary: "#D80621", secondary: "#FFFFFF", accent: "#000000", pattern: "vertical" },
  "Bosnia and Herzegovina": { primary: "#002395", secondary: "#FECB00", accent: "#FFFFFF", pattern: "vertical" },
  Qatar: { primary: "#8A1538", secondary: "#FFFFFF", accent: "#6b1428", pattern: "solid" },
  Switzerland: { primary: "#DA291C", secondary: "#FFFFFF", accent: "#000000", pattern: "vertical" },
  Brazil: { primary: "#FEDF00", secondary: "#009C3B", accent: "#002776", pattern: "vertical" },
  Morocco: { primary: "#C1272D", secondary: "#006233", accent: "#FFFFFF", pattern: "vertical" },
  Haiti: { primary: "#00209F", secondary: "#D21034", accent: "#FFFFFF", pattern: "vertical" },
  Scotland: { primary: "#0065BF", secondary: "#FFFFFF", accent: "#0065BF", pattern: "vertical" },
  USA: { primary: "#3C3B6E", secondary: "#B22234", accent: "#FFFFFF", pattern: "vertical" },
  Paraguay: { primary: "#D52B1E", secondary: "#0038A8", accent: "#FFFFFF", pattern: "vertical" },
  Australia: { primary: "#FCD116", secondary: "#00843D", accent: "#012169", pattern: "vertical" },
  Türkiye: { primary: "#E30A17", secondary: "#FFFFFF", accent: "#E30A17", pattern: "solid" },
  Germany: { primary: "#FFFFFF", secondary: "#000000", accent: "#DD0000", pattern: "vertical" },
  Curaçao: { primary: "#002B7F", secondary: "#F9D616", accent: "#FFFFFF", pattern: "vertical" },
  "Côte d'Ivoire": { primary: "#F77F00", secondary: "#009E60", accent: "#FFFFFF", pattern: "vertical" },
  Ecuador: { primary: "#FCD116", secondary: "#003893", accent: "#CE1126", pattern: "vertical" },
  Netherlands: { primary: "#FF6B00", secondary: "#21468B", accent: "#FFFFFF", pattern: "split" },
  Japan: { primary: "#003BC6", secondary: "#FFFFFF", accent: "#BC002D", pattern: "solid" },
  Sweden: { primary: "#006AA7", secondary: "#FECC00", accent: "#006AA7", pattern: "vertical" },
  Tunisia: { primary: "#E70013", secondary: "#FFFFFF", accent: "#000000", pattern: "solid" },
  Belgium: { primary: "#ED2939", secondary: "#000000", accent: "#FAE042", pattern: "vertical" },
  Egypt: { primary: "#CE1126", secondary: "#000000", accent: "#FFFFFF", pattern: "vertical" },
  "IR Iran": { primary: "#239F40", secondary: "#FFFFFF", accent: "#DA0000", pattern: "vertical" },
  "New Zealand": { primary: "#000000", secondary: "#FFFFFF", accent: "#000000", pattern: "vertical" },
  Spain: { primary: "#AA151B", secondary: "#F1BF00", accent: "#AA151B", pattern: "solid" },
  "Cabo Verde": { primary: "#003893", secondary: "#CF2027", accent: "#F7D116", pattern: "vertical" },
  "Saudi Arabia": { primary: "#006C35", secondary: "#FFFFFF", accent: "#006C35", pattern: "solid" },
  Uruguay: { primary: "#7BABDA", secondary: "#FFFFFF", accent: "#0038A8", pattern: "vertical" },
  France: { primary: "#002395", secondary: "#FFFFFF", accent: "#ED2939", pattern: "vertical" },
  Senegal: { primary: "#00853F", secondary: "#FCD116", accent: "#E31B23", pattern: "vertical" },
  Iraq: { primary: "#FFFFFF", secondary: "#CE1126", accent: "#000000", pattern: "vertical" },
  Norway: { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", pattern: "vertical" },
  Argentina: { primary: "#75AADB", secondary: "#FFFFFF", accent: "#000000", pattern: "argentina" },
  Algeria: { primary: "#FFFFFF", secondary: "#006233", accent: "#D21034", pattern: "vertical" },
  Austria: { primary: "#ED2939", secondary: "#FFFFFF", accent: "#000000", pattern: "solid" },
  Jordan: { primary: "#000000", secondary: "#FFFFFF", accent: "#CE1126", pattern: "vertical" },
  Portugal: { primary: "#DA020E", secondary: "#006600", accent: "#FFD900", pattern: "vertical" },
  "Congo DR": { primary: "#007FFF", secondary: "#F7D116", accent: "#CE1126", pattern: "vertical" },
  Uzbekistan: { primary: "#1EB53A", secondary: "#FFFFFF", accent: "#0099B5", pattern: "vertical" },
  Colombia: { primary: "#FCD116", secondary: "#003893", accent: "#CE1126", pattern: "vertical" },
  England: { primary: "#FFFFFF", secondary: "#CF081F", accent: "#00247D", pattern: "vertical" },
  Croatia: { primary: "#FFFFFF", secondary: "#C8102E", accent: "#171796", pattern: "vertical" },
  Ghana: { primary: "#006B3F", secondary: "#FCD116", accent: "#CE1126", pattern: "vertical" },
  Panama: { primary: "#DA121A", secondary: "#FFFFFF", accent: "#072357", pattern: "vertical" },
}

for (const name of Object.keys(TEAM_FLAG_CODES)) {
  if (!TEAM_KITS[name]) TEAM_KITS[name] = { ...DEFAULT_KIT }
}

export function getKitForTeam(team: string): KitStyle {
  return TEAM_KITS[team] ?? DEFAULT_KIT
}

type PlayerRow = { id: string; team: string; name: string }

/**
 * Stable shirt numbers per squad: sort by name (A–Z), assign 1 … N (N = squad size).
 * Typical squads are ≤26; if your data has more, numbers continue past 26 (unique).
 */
export function squadShirtNumbers(players: PlayerRow[]): Map<string, number> {
  const byTeam = new Map<string, PlayerRow[]>()
  for (const p of players) {
    const t = p.team || "?"
    const list = byTeam.get(t) ?? []
    list.push(p)
    byTeam.set(t, list)
  }
  const out = new Map<string, number>()
  for (const [, list] of byTeam) {
    list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    list.forEach((p, i) => {
      out.set(p.id, i + 1)
    })
  }
  return out
}

export function kitShirtBackground(kit: KitStyle): { background: string } {
  const { primary, secondary, pattern } = kit
  switch (pattern) {
    case "vertical":
      return {
        background: `repeating-linear-gradient(90deg, ${primary} 0, ${primary} 42%, ${secondary} 42%, ${secondary} 58%, ${primary} 58%, ${primary} 100%)`,
      }
    case "split":
      return { background: `linear-gradient(90deg, ${primary} 50%, ${secondary} 50%)` }
    case "argentina":
      return {
        background: `repeating-linear-gradient(90deg, ${primary} 0, ${primary} 14px, ${secondary} 14px, ${secondary} 28px)`,
      }
    default:
      return { background: primary }
  }
}
