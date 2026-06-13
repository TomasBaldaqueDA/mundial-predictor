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

const PODIUM_CONFIGS = [
  {
    ring: "ring-amber-400/35",
    bg: "bg-amber-400/8",
    avatarBg: "bg-amber-500",
    text: "text-amber-200",
    pts: "text-amber-200",
    rank: "1",
  },
  {
    ring: "ring-slate-400/35",
    bg: "bg-slate-400/8",
    avatarBg: "bg-slate-500",
    text: "text-slate-200",
    pts: "text-slate-200",
    rank: "2",
  },
  {
    ring: "ring-orange-800/40",
    bg: "bg-orange-950/10",
    avatarBg: "bg-amber-700",
    text: "text-orange-300",
    pts: "text-orange-300",
    rank: "3",
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
      <div className={`${podCfg.bg} border-b border-white/5 last:border-0`}>
        <div className="hidden sm:grid sm:grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3.5 items-center gap-0">
          <div className="flex items-center justify-center">
            <div
              className={`w-9 h-9 rounded-xl ${podCfg.avatarBg} ring-1 ${podCfg.ring} flex items-center justify-center text-white font-black text-xs shrink-0`}
            >
              {podCfg.rank}
            </div>
          </div>
          <div className={`font-bold text-sm truncate pl-1 ${podCfg.text}`}>
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
            className={`w-9 h-9 rounded-xl ${podCfg.avatarBg} ring-1 ${podCfg.ring} flex items-center justify-center text-white font-black text-xs shrink-0 mx-auto row-span-2`}
          >
            {podCfg.rank}
          </div>
          <div className={`font-bold text-sm truncate min-w-0 ${podCfg.text}`}>
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
