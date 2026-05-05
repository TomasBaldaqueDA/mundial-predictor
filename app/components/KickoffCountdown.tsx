"use client"

import { useEffect, useState } from "react"

/**
 * Tiny "kicks off in 1h 23m" badge. Renders nothing past kickoff or for matches
 * more than 48h away. Updates once per minute. Time math is local to the user.
 */
export function KickoffCountdown({ kickoff }: { kickoff: string }) {
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const target = new Date(kickoff).getTime()
  if (!Number.isFinite(target)) return null
  const diff = target - now
  if (diff <= 0) return null
  if (diff > 48 * 60 * 60 * 1000) return null

  const totalMinutes = Math.floor(diff / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const label =
    hours >= 1 ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`

  const soon = diff <= 60 * 60 * 1000
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${
        soon
          ? "bg-amber-500/15 text-amber-100 border-amber-400/40"
          : "bg-cyan-500/10 text-cyan-100 border-cyan-400/30"
      }`}
      aria-live="polite"
    >
      <span aria-hidden>⏱</span>
      Kicks off in {label}
    </span>
  )
}
