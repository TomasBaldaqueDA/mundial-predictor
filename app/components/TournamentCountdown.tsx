"use client"

import { useEffect, useState } from "react"

// World Cup 2026 opening match: June 11, 2026 20:00 Mexico City (UTC-5)
const WC_START = new Date("2026-06-12T01:00:00Z")

function getTimeLeft() {
  const diff = WC_START.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

export function TournamentCountdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)

  useEffect(() => {
    // Tick immediately then every second
    const tick = () => setTimeLeft(getTimeLeft()) // eslint-disable-line react-hooks/set-state-in-effect
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  if (!timeLeft) return null

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ]

  return (
    <div className="mt-7 mb-2">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.25em] text-center mb-3">
        Kickoff in
      </p>
      <div className="flex justify-center gap-2 sm:gap-3">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="glass rounded-xl w-14 sm:w-16 h-12 sm:h-14 flex items-center justify-center border border-wc-gold/25 shadow-[0_0_20px_rgba(240,180,41,0.12)]">
              <span className="text-xl sm:text-2xl font-black text-wc-gold tabular-nums [font-family:var(--font-outfit)]">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] font-semibold text-white/35 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
