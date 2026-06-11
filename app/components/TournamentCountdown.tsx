"use client"

import { useEffect, useState } from "react"

// Opener: Mexico vs South Africa, 16:00 Brasilia / 13:00 CDMX = 19:00 UTC, 11 Jun 2026.
const WC_START = new Date("2026-06-11T19:00:00Z")

function getTimeLeft() {
  const diff = WC_START.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
  }
}

export function TournamentCountdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(() => getTimeLeft())

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 60_000)
    return () => clearInterval(t)
  }, [])

  if (!timeLeft) return null

  return (
    <p className="mt-6 text-sm text-white/50 tabular-nums">
      <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mr-2">Kickoff in</span>
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </p>
  )
}
