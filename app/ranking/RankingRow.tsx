"use client"

import { useState } from "react"
import { PlayerNameLink } from "@/app/components/PlayerNameLink"

type Row = {
  userId?: string
  name: string
  matchPts: number
  groupPts: number
  specialPts: number
  fiveASidePts: number
  points: number
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

const PODIUM_CONFIGS = [
  {
    ring: "ring-amber-400/60",
    bg: "bg-amber-400/15",
    avatarBg: "bg-gradient-to-br from-amber-300 to-amber-500",
    text: "text-amber-300",
    pts: "text-amber-300",
    border: "border-amber-400/30",
    label: "1st",
    medal: "🥇",
    glow: "shadow-[0_0_32px_rgba(251,191,36,0.25)]",
  },
  {
    ring: "ring-slate-400/50",
    bg: "bg-slate-400/10",
    avatarBg: "bg-gradient-to-br from-slate-300 to-slate-500",
    text: "text-slate-200",
    pts: "text-slate-200",
    border: "border-slate-400/25",
    label: "2nd",
    medal: "🥈",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.15)]",
  },
  {
    ring: "ring-amber-700/50",
    bg: "bg-amber-700/10",
    avatarBg: "bg-gradient-to-br from-amber-600 to-amber-800",
    text: "text-amber-600",
    pts: "text-amber-600",
    border: "border-amber-700/25",
    label: "3rd",
    medal: "🥉",
    glow: "shadow-[0_0_16px_rgba(180,83,9,0.2)]",
  },
]

export function RankingRow({ row, index }: { row: Row; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const podCfg = index < 3 ? PODIUM_CONFIGS[index] : null

  if (podCfg) {
    return (
      <div className={`${podCfg.bg} ${podCfg.glow} border-b border-white/5 last:border-0`}>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="w-full grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3.5 items-center text-left gap-2 sm:gap-0"
        >
          {/* Avatar (replaces rank number) */}
          <div className={`w-9 h-9 rounded-xl ${podCfg.avatarBg} ring-2 ${podCfg.ring} flex items-center justify-center text-white font-black text-sm shrink-0 mx-auto`}>
            {initials(row.name)}
          </div>
          {/* Name */}
          <div className={`font-bold text-sm truncate pl-1 ${podCfg.text}`}>
            {podCfg.medal}{" "}
            <PlayerNameLink userId={row.userId} name={row.name} className={podCfg.text} stopPropagation />
          </div>
          {/* Desktop columns */}
          <div className={`text-right text-sm tabular-nums hidden sm:block ${podCfg.text} opacity-80`}>{row.matchPts}</div>
          <div className={`text-right text-sm tabular-nums hidden sm:block ${podCfg.text} opacity-80`}>{row.specialPts}</div>
          <div className={`text-right text-sm tabular-nums hidden sm:block ${podCfg.text} opacity-80`}>{row.groupPts}</div>
          <div className={`text-right text-sm tabular-nums hidden sm:block ${podCfg.text} opacity-80`}>{row.fiveASidePts}</div>
          {/* Total */}
          <div className={`text-right font-black text-lg tabular-nums sm:col-auto ${podCfg.pts}`}>
            {row.points}
            <span className="text-xs font-normal ml-0.5 opacity-60">pts</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`sm:hidden inline-block w-3 h-3 ml-1 opacity-40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
        {expanded && (
          <div className="sm:hidden px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs border-t border-white/10">
            <span className="text-white/35 pt-2">Games</span><span className={`text-right tabular-nums pt-2 ${podCfg.text}`}>{row.matchPts}</span>
            <span className="text-white/35">Questions</span><span className={`text-right tabular-nums ${podCfg.text}`}>{row.specialPts}</span>
            <span className="text-white/35">Groups</span><span className={`text-right tabular-nums ${podCfg.text}`}>{row.groupPts}</span>
            <span className="text-white/35">5-A-Side</span><span className={`text-right tabular-nums ${podCfg.text}`}>{row.fiveASidePts}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.03]">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`rank-${index}-detail`}
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3 items-center text-left gap-2 sm:gap-0"
      >
        {/* Rank number */}
        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold text-white/25 tabular-nums">{index + 1}</span>
        </div>
        {/* Name */}
        <div className="font-medium text-sm text-white/75 truncate pl-1">
          <PlayerNameLink userId={row.userId} name={row.name} className="text-white/75" stopPropagation />
        </div>
        {/* Desktop columns */}
        <div className="text-right text-sm text-white/35 tabular-nums hidden sm:block">{row.matchPts}</div>
        <div className="text-right text-sm text-white/35 tabular-nums hidden sm:block">{row.specialPts}</div>
        <div className="text-right text-sm text-white/35 tabular-nums hidden sm:block">{row.groupPts}</div>
        <div className="text-right text-sm text-white/35 tabular-nums hidden sm:block">{row.fiveASidePts}</div>
        {/* Total — always visible */}
        <div className="text-right font-bold text-sm tabular-nums text-white/80 sm:col-auto">
          {row.points}
          {/* Mobile expand chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`sm:hidden inline-block w-3 h-3 ml-1 text-white/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div
          id={`rank-${index}-detail`}
          className="sm:hidden px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs border-t border-white/5"
        >
          <span className="text-white/35 pt-2">Games</span><span className="text-right text-white/70 tabular-nums pt-2">{row.matchPts}</span>
          <span className="text-white/35">Questions</span><span className="text-right text-white/70 tabular-nums">{row.specialPts}</span>
          <span className="text-white/35">Groups</span><span className="text-right text-white/70 tabular-nums">{row.groupPts}</span>
          <span className="text-white/35">5-A-Side</span><span className="text-right text-white/70 tabular-nums">{row.fiveASidePts}</span>
        </div>
      )}
    </div>
  )
}
