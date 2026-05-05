"use client"

import { useState } from "react"

type Row = {
  name: string
  matchPts: number
  groupPts: number
  specialPts: number
  fiveASidePts: number
  points: number
}

const podium = (i: number) => {
  if (i === 0) return { emoji: "🥇", bg: "bg-amber-400/10 border-amber-400/25", text: "text-amber-400" }
  if (i === 1) return { emoji: "🥈", bg: "bg-slate-400/10 border-slate-400/20", text: "text-slate-300" }
  if (i === 2) return { emoji: "🥉", bg: "bg-amber-700/10 border-amber-700/20", text: "text-amber-600" }
  return null
}

export function RankingRow({ row, index }: { row: Row; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const pod = podium(index)

  return (
    <div
      className={`transition-colors duration-150 hover:bg-white/10 ${
        pod ? pod.bg + " border-l-2" : "border-l-2 border-transparent"
      }`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`rank-${index}-detail`}
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem_1.5rem] sm:grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3.5 items-center text-left"
      >
        <div className="flex items-center justify-center">
          {pod ? (
            <span className="text-xl leading-none" aria-label={`Place ${index + 1}`}>
              {pod.emoji}
            </span>
          ) : (
            <span className="text-sm font-semibold text-white/35 tabular-nums">{index + 1}</span>
          )}
        </div>
        <div className={`pl-2 font-semibold text-sm truncate ${pod ? pod.text : "text-white/85"}`}>{row.name}</div>
        <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.matchPts}</div>
        <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.specialPts}</div>
        <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.groupPts}</div>
        <div className="text-right text-sm text-white/40 tabular-nums hidden sm:block">{row.fiveASidePts}</div>
        <div className={`text-right font-black text-base tabular-nums ${pod ? "text-wc-gold" : "text-white/90"}`}>
          {row.points}
        </div>
        <div className="sm:hidden flex items-center justify-end text-white/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      {expanded && (
        <div
          id={`rank-${index}-detail`}
          className="sm:hidden px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs"
        >
          <span className="text-white/40">Games</span>
          <span className="text-right text-white/85 tabular-nums">{row.matchPts}</span>
          <span className="text-white/40">Questions</span>
          <span className="text-right text-white/85 tabular-nums">{row.specialPts}</span>
          <span className="text-white/40">Groups</span>
          <span className="text-right text-white/85 tabular-nums">{row.groupPts}</span>
          <span className="text-white/40">5-A-Side</span>
          <span className="text-right text-white/85 tabular-nums">{row.fiveASidePts}</span>
        </div>
      )}
    </div>
  )
}
