"use client"

import { useEffect, useState } from "react"

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
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(() => getTimeLeft())

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
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
    <div className="mt-8 mb-2">
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.28em] text-center mb-4">Kickoff in</p>
      <div className="flex justify-center gap-2 sm:gap-3">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="glass rounded-xl w-[3.25rem] sm:w-16 h-14 sm:h-16 flex items-center justify-center border border-wc-gold/20 shadow-[0_0_32px_rgba(232,184,74,0.12)]">
              <span className="text-2xl sm:text-[1.65rem] font-black text-wc-gold tabular-nums [font-family:var(--font-outfit)]">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
