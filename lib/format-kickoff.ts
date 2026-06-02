/**
 * Kickoff instants from the API (timestamptz / ISO). Display uses the viewer's
 * browser timezone via toLocaleString(undefined, …).
 */

const NAIVE_KICKOFF_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/

function hasExplicitTimezone(s: string): boolean {
  return /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(s.trim())
}

/** Parse DB/API kickoff to a single instant (UTC internally). */
export function parseKickoffInstant(kickoff_time: string): Date | null {
  const s = kickoff_time.trim()
  if (!s) return null

  if (hasExplicitTimezone(s)) {
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const m = s.match(NAIVE_KICKOFF_RE)
  if (m) {
    const [, y, mo, d, h, min, sec = "0"] = m
    const parsed = new Date(Date.UTC(+y, +mo - 1, +d, +h, +min, +sec))
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

export function getKickoffTimestamp(kickoff_time: string): number {
  return parseKickoffInstant(kickoff_time)?.getTime() ?? NaN
}

/** Format kickoff in the browser's local timezone (call from client after mount). */
export function formatKickoffInBrowserTimezone(kickoff_time: string): string {
  const d = parseKickoffInstant(kickoff_time)
  if (!d) return kickoff_time.trim()

  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/** @deprecated Prefer KickoffText on the client; kept for non-UI logic. */
export function formatKickoffDisplay(kickoff_time: string): string {
  return formatKickoffInBrowserTimezone(kickoff_time)
}
