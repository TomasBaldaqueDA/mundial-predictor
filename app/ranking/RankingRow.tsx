"use client"

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
    medal: "🥇",
    glow: "shadow-[0_0_32px_rgba(251,191,36,0.25)]",
  },
  {
    ring: "ring-slate-400/50",
    bg: "bg-slate-400/10",
    avatarBg: "bg-gradient-to-br from-slate-300 to-slate-500",
    text: "text-slate-200",
    pts: "text-slate-200",
    medal: "🥈",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.15)]",
  },
  {
    ring: "ring-amber-700/50",
    bg: "bg-amber-700/10",
    avatarBg: "bg-gradient-to-br from-amber-600 to-amber-800",
    text: "text-amber-600",
    pts: "text-amber-600",
    medal: "🥉",
    glow: "shadow-[0_0_16px_rgba(180,83,9,0.2)]",
  },
]

function MobileCategoryPts({
  row,
  className = "text-white/70",
}: {
  row: Row
  className?: string
}) {
  return (
    <div className={`grid grid-cols-4 gap-1 text-xs tabular-nums ${className}`}>
      <div className="text-center">
        <span className="block text-white/30 uppercase tracking-wide text-xs">Gms</span>
        {row.matchPts}
      </div>
      <div className="text-center">
        <span className="block text-white/30 uppercase tracking-wide text-xs">Q</span>
        {row.specialPts}
      </div>
      <div className="text-center">
        <span className="block text-white/30 uppercase tracking-wide text-xs">Grp</span>
        {row.groupPts}
      </div>
      <div className="text-center">
        <span className="block text-white/30 uppercase tracking-wide text-xs">5v5</span>
        {row.fiveASidePts}
      </div>
    </div>
  )
}

function DesktopCells({
  row,
  className = "text-white/35",
}: {
  row: Row
  className?: string
}) {
  return (
    <>
      <div className={`text-right text-sm tabular-nums hidden sm:block ${className}`}>{row.matchPts}</div>
      <div className={`text-right text-sm tabular-nums hidden sm:block ${className}`}>{row.specialPts}</div>
      <div className={`text-right text-sm tabular-nums hidden sm:block ${className}`}>{row.groupPts}</div>
      <div className={`text-right text-sm tabular-nums hidden sm:block ${className}`}>{row.fiveASidePts}</div>
    </>
  )
}

export function RankingRow({ row, index }: { row: Row; index: number }) {
  const podCfg = index < 3 ? PODIUM_CONFIGS[index] : null

  if (podCfg) {
    return (
      <div className={`${podCfg.bg} ${podCfg.glow} border-b border-white/5 last:border-0`}>
        <div className="hidden sm:grid sm:grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3.5 items-center gap-0">
          <div className="flex items-center justify-center">
            <div
              className={`w-9 h-9 rounded-xl ${podCfg.avatarBg} ring-2 ${podCfg.ring} flex items-center justify-center text-white font-black text-sm shrink-0`}
            >
              {initials(row.name)}
            </div>
          </div>
          <div className={`font-bold text-sm truncate pl-1 ${podCfg.text}`}>
            {podCfg.medal}{" "}
            <PlayerNameLink userId={row.userId} name={row.name} className={podCfg.text} />
          </div>
          <DesktopCells row={row} className={`${podCfg.text} opacity-80`} />
          <div className={`text-right font-black text-lg tabular-nums ${podCfg.pts}`}>
            {row.points}
            <span className="text-xs font-normal ml-0.5 opacity-60">pts</span>
          </div>
        </div>
        <div className="sm:hidden px-4 py-3 grid grid-cols-[2.5rem_1fr_auto] gap-x-2 gap-y-2 items-center">
          <div
            className={`w-9 h-9 rounded-xl ${podCfg.avatarBg} ring-2 ${podCfg.ring} flex items-center justify-center text-white font-black text-sm shrink-0 mx-auto row-span-2`}
          >
            {initials(row.name)}
          </div>
          <div className={`font-bold text-sm truncate min-w-0 ${podCfg.text}`}>
            {podCfg.medal}{" "}
            <PlayerNameLink userId={row.userId} name={row.name} className={podCfg.text} />
          </div>
          <div className={`text-right font-black text-lg tabular-nums row-span-2 self-center ${podCfg.pts}`}>
            {row.points}
            <span className="text-xs font-normal ml-0.5 opacity-60">pts</span>
          </div>
          <div className="col-span-2 min-w-0">
            <MobileCategoryPts row={row} className={podCfg.text} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.03]">
      <div className="hidden sm:grid sm:grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3 items-center gap-0">
        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold text-white/25 tabular-nums">{index + 1}</span>
        </div>
        <div className="font-medium text-sm text-white/75 truncate pl-1">
          <PlayerNameLink userId={row.userId} name={row.name} className="text-white/75" />
        </div>
        <DesktopCells row={row} />
        <div className="text-right font-bold text-sm tabular-nums text-white/80">
          {row.points}
          <span className="text-xs font-normal text-white/40 ml-0.5">pts</span>
        </div>
      </div>
      <div className="sm:hidden px-4 py-3 grid grid-cols-[2.5rem_1fr_auto] gap-x-2 gap-y-2 items-center">
        <div className="flex items-center justify-center row-span-2">
          <span className="text-sm font-semibold text-white/25 tabular-nums">{index + 1}</span>
        </div>
        <div className="font-medium text-sm text-white/75 truncate min-w-0">
          <PlayerNameLink userId={row.userId} name={row.name} className="text-white/75" />
        </div>
        <div className="text-right font-bold text-sm tabular-nums text-white/80 row-span-2 self-center">
          {row.points}
          <span className="text-xs font-normal text-white/40 ml-0.5">pts</span>
        </div>
        <div className="col-span-2 min-w-0">
          <MobileCategoryPts row={row} />
        </div>
      </div>
    </div>
  )
}
