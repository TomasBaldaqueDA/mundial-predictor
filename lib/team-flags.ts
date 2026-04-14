/**
 * Map team names (as in group_teams) to ISO 3166-1 alpha-2 codes for flag images.
 * Used on the home page.
 */
export const TEAM_FLAG_CODES: Record<string, string> = {
  "Mexico": "mx",
  "South Africa": "za",
  "Korea Republic": "kr",
  "Czechia": "cz",
  "Canada": "ca",
  "Bosnia and Herzegovina": "ba",
  "Qatar": "qa",
  "Switzerland": "ch",
  "Brazil": "br",
  "Morocco": "ma",
  "Haiti": "ht",
  "Scotland": "custom", // SVG below (saltire)
  "USA": "us",
  "Paraguay": "py",
  "Australia": "au",
  "Türkiye": "tr",
  "Germany": "de",
  "Curaçao": "cw",
  "Côte d'Ivoire": "ci",
  "Ecuador": "ec",
  "Netherlands": "nl",
  "Japan": "jp",
  "Sweden": "se",
  "Tunisia": "tn",
  "Belgium": "be",
  "Egypt": "eg",
  "IR Iran": "ir",
  "New Zealand": "nz",
  "Spain": "es",
  "Cabo Verde": "cv",
  "Saudi Arabia": "sa",
  "Uruguay": "uy",
  "France": "fr",
  "Senegal": "sn",
  "Iraq": "iq",
  "Norway": "no",
  "Argentina": "ar",
  "Algeria": "dz",
  "Austria": "at",
  "Jordan": "jo",
  "Portugal": "pt",
  "Congo DR": "cd",
  "Uzbekistan": "uz",
  "Colombia": "co",
  "England": "custom", // SVG below (St George's cross)
  "Croatia": "hr",
  "Ghana": "gh",
  "Panama": "pa",
}

/** All 48 team names in group order (A–L, 4 per group) for the home page. */
export const TEAMS_BY_GROUP: { groupCode: string; teams: string[] }[] = [
  { groupCode: "A", teams: ["Mexico", "South Africa", "Korea Republic", "Czechia"] },
  { groupCode: "B", teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"] },
  { groupCode: "C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { groupCode: "D", teams: ["USA", "Paraguay", "Australia", "Türkiye"] },
  { groupCode: "E", teams: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"] },
  { groupCode: "F", teams: ["Netherlands", "Japan", "Sweden", "Tunisia"] },
  { groupCode: "G", teams: ["Belgium", "Egypt", "IR Iran", "New Zealand"] },
  { groupCode: "H", teams: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"] },
  { groupCode: "I", teams: ["France", "Senegal", "Iraq", "Norway"] },
  { groupCode: "J", teams: ["Argentina", "Algeria", "Austria", "Jordan"] },
  { groupCode: "K", teams: ["Portugal", "Congo DR", "Uzbekistan", "Colombia"] },
  { groupCode: "L", teams: ["England", "Croatia", "Ghana", "Panama"] },
]

const FLAG_CDN = "https://flagcdn.com"

// England: St George's Cross (red cross on white)
const ENGLAND_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect width="60" height="30" fill="#fff"/><path d="M0 12h60v6H0z" fill="#C8102E"/><path d="M27 0h6v30h-6z" fill="#C8102E"/></svg>'
// Scotland: St Andrew's Saltire (white diagonal cross on blue)
const SCOTLAND_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect width="60" height="30" fill="#0065BF"/><rect x="-12" y="11" width="84" height="8" fill="#fff" transform="rotate(-45 30 15)"/><rect x="-12" y="11" width="84" height="8" fill="#fff" transform="rotate(45 30 15)"/></svg>'

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function getFlagSrc(teamName: string, size: "w40" | "w80" = "w40"): string {
  if (teamName === "England") return svgToDataUri(ENGLAND_SVG)
  if (teamName === "Scotland") return svgToDataUri(SCOTLAND_SVG)
  const code = TEAM_FLAG_CODES[teamName] ?? "un"
  return `${FLAG_CDN}/${size}/${code}.png`
}