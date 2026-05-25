"use client"

import { useMemo } from "react"
import { FlagImage } from "@/app/components/FlagImage"
import { getFlagSrc } from "@/lib/team-flags"
import {
  LINEUP_SLOTS,
  pickIdForSlot,
  playerFantasyPoints,
  type FiveASidePicks,
  type FiveASidePlayer,
  type SlotKey,
} from "@/lib/five-a-side"
import { squadShirtNumbers } from "@/lib/team-kit"

type Props = {
  picks: FiveASidePicks
  players: FiveASidePlayer[]
  teamGpByTeam: Record<string, number>
}

export function FiveASideLineupReadonly({ picks, players, teamGpByTeam }: Props) {
  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players])
  const shirtNumberByPlayerId = useMemo(() => squadShirtNumbers(players), [players])

  function getPlayer(slot: SlotKey): FiveASidePlayer | null {
    const id = pickIdForSlot(picks, slot)
    if (!id) return null
    return playersById.get(id) ?? null
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-cyan-400/15 bg-gradient-to-b from-[#121a2e] via-[#0a1020] to-[#020617] shadow-[0_4px_32px_rgba(0,0,0,0.48)]">
      <div className="relative flex flex-row flex-nowrap justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-6 sm:py-8 px-4 sm:px-6 pb-8 [scrollbar-width:thin] snap-x snap-mandatory md:snap-none">
        {LINEUP_SLOTS.map(({ slot, badge, label }) => {
          const player = getPlayer(slot)
          const points = player ? playerFantasyPoints(player) : 0
          const gp = player ? (teamGpByTeam[player.team] ?? 0) : 0
          const shirt = player ? (shirtNumberByPlayerId.get(player.id) ?? 1) : 0
          return (
            <div key={slot} className="flex flex-col items-center gap-2 shrink-0 snap-center">
              <div className="w-[9.25rem] sm:w-40 rounded-2xl border-2 border-cyan-400/22 bg-gradient-to-b from-[#28344e]/95 to-[#0e1628] overflow-hidden">
                <div className="flex items-center justify-between px-2 pt-1.5 pb-1 text-[8px] font-bold uppercase tracking-wider text-slate-400/90">
                  <span>WC26</span>
                  <span className="rounded bg-black/25 px-1 py-0.5 text-[7px] text-white/90">{badge}</span>
                </div>
                {player ? (
                  <div className="px-2 pb-3 text-center">
                    <div className="flex justify-center mb-1">
                      <FlagImage
                        src={getFlagSrc(player.team)}
                        alt=""
                        className="h-8 w-12 rounded-sm object-cover ring-1 ring-white/20"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-100 leading-tight line-clamp-2 min-h-[2rem]">
                      {player.name}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">{player.team}</p>
                    <p className="text-[9px] text-slate-500 mt-1 tabular-nums">
                      #{shirt} · GP {gp}
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-0.5 text-[8px] text-slate-400">
                      <span>G {player.goals}</span>
                      <span>A {player.assists}</span>
                      {(player.position === "gk" || player.position === "df") && (
                        <span>CS {player.clean_sheets}</span>
                      )}
                      <span>MVP {player.mvp}</span>
                    </div>
                  </div>
                ) : (
                  <div className="px-2 pb-4 pt-2 text-center text-[10px] text-slate-500">{label} — empty</div>
                )}
              </div>
              <div
                className={`rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums border ${
                  player
                    ? points > 0
                      ? "bg-emerald-500/25 text-emerald-100 border-emerald-400/45"
                      : "bg-white/92 text-slate-800 border-white/60"
                    : "border-white/10 bg-white/5 min-w-[4.5rem] min-h-[1.75rem]"
                }`}
              >
                {player ? (
                  <>
                    {points > 0 ? "+" : ""}
                    {points} pts
                  </>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <p className="pb-4 text-center text-[11px] text-slate-400 md:hidden">Swipe horizontally to view all 5 players.</p>
    </div>
  )
}
