/**
 * Format kickoff for display. Matches store naive stadium-local times; formatting
 * must not use default locale (SSR Node vs browser would mismatch on hydration).
 */
export function formatKickoffDisplay(kickoff_time: string): string {
  const s = kickoff_time.trim()
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/)
  if (m) {
    const [, y, mo, d, h, min] = m
    return `${d}/${mo}/${y}, ${h}:${min}`
  }
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
  return s
}