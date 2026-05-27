"use client"

import { useMemo } from "react"
import { FlagImage } from "@/app/components/FlagImage"
import { getFlagSrc } from "@/lib/team-flags"
import {
  LINEUP_SLOTS,
  pickIdForSlot,
  slotFantasyPoints,
  supersubOutFrozenDisplay,
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

  const captainId = picks.captain_player_id ?? null
  const supersubApplied = !!picks.supersub_applied_at

  return (
    <div className="space-y-4">
      {(captainId || supersubApplied) && (
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          {captainId && (
            <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-amber-100">
              Captain: {playersById.get(captainId)?.name ?? "—"} (×2 pts)
            </span>
          )}
          {supersubApplied && picks.supersub_out_player_id && picks.supersub_in_player_id && (
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
              Supersub: {playersById.get(picks.supersub_out_player_id)?.name ?? "—"} →{" "}
              {playersById.get(picks.supersub_in_player_id)?.name ?? "—"}
            </span>
          )}
        </div>
      )}

      <div className="relative rounded-3xl overflow-hidden border border-cyan-400/15 bg-gradient-to-b from-[#121a2e] via-[#0a1020] to-[#020617] shadow-[0_4px_32px_rgba(0,0,0,0.48)]">
        <div className="relative flex flex-row flex-nowrap justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-6 sm:py-8 px-4 sm:px-6 pb-8 [scrollbar-width:thin] snap-x snap-mandatory md:snap-none">
          {LINEUP_SLOTS.map(({ slot, badge, label }) => {
            const player = getPlayer(slot)
            const points = slotFantasyPoints(picks, slot, playersById)
            const supersubOnSlot = supersubApplied && picks.supersub_slot === slot
            const subbedOut = supersubOnSlot ? supersubOutFrozenDisplay(picks, playersById) : null
            const gp = player ? (teamGpByTeam[player.team] ?? 0) : 0
            const shirt = player ? (shirtNumberByPlayerId.get(player.id) ?? 1) : 0
            const isCaptain = !!(player && captainId === player.id)
            const wasSubbedOut =
              supersubApplied && picks.supersub_slot === slot && picks.supersub_out_player_id === captainId
            return (
              <div key={slot} className="flex flex-col items-center gap-2 shrink-0 snap-center">
                {subbedOut && (
                  <>
                    <ReadonlyMiniCard
                      player={subbedOut.player}
                      badge={badge}
                      shirt={shirtNumberByPlayerId.get(subbedOut.player.id) ?? 1}
                      gp={teamGpByTeam[subbedOut.player.team] ?? 0}
                      isCaptain={captainId === subbedOut.player.id}
                      substitutedOut
                    />
                    <span className="text-[10px] font-black tabular-nums text-white/45 border border-white/10 rounded-full px-2 py-0.5">
                      {subbedOut.points} pts until sub
                    </span>
                    <span className="text-cyan-400/60 text-[10px]" aria-hidden>
                      ↓
                    </span>
                  </>
                )}
                <div
                  className={`w-[9.25rem] sm:w-40 rounded-2xl border-2 bg-gradient-to-b from-[#28344e]/95 to-[#0e1628] overflow-hidden ${
                    supersubOnSlot ? "border-cyan-400/35 ring-1 ring-cyan-400/20" : "border-cyan-400/22"
                  }`}
                >
                  <div className="flex items-center justify-between px-2 pt-1.5 pb-1 text-[8px] font-bold uppercase tracking-wider text-slate-400/90">
                    <span>WC26</span>
                    <span className="flex items-center gap-1">
                      {isCaptain && (
                        <span className="rounded bg-amber-500/90 px-1 py-0.5 text-[7px] font-black text-black">C</span>
                      )}
                      {wasSubbedOut && !isCaptain && (
                        <span className="rounded bg-amber-500/40 px-1 py-0.5 text-[7px] text-amber-100" title="Captain subbed out">
                          C†
                        </span>
                      )}
                      <span className="rounded bg-black/25 px-1 py-0.5 text-[7px] text-white/90">{badge}</span>
                    </span>
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
                      {points} pts{supersubOnSlot ? " total" : ""}
                    </>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
        <p className="pb-4 text-center text-[11px] text-slate-400 md:hidden">Swipe horizontally to view all 5 players.</p>
      </div>
    </div>
  )
}

function ReadonlyMiniCard({
  player,
  badge,
  shirt,
  gp,
  isCaptain,
  substitutedOut,
}: {
  player: FiveASidePlayer
  badge: string
  shirt: number
  gp: number
  isCaptain: boolean
  substitutedOut?: boolean
}) {
  return (
    <div
      className={`relative w-[9.25rem] sm:w-40 rounded-2xl border-2 overflow-hidden scale-[0.88] opacity-50 grayscale-[0.35] ${
        substitutedOut ? "border-white/10" : "border-cyan-400/22"
      }`}
    >
      {substitutedOut && (
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-slate-900/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-300">
          Substituted
        </div>
      )}
      <div className="flex items-center justify-between px-2 pt-1.5 pb-1 text-[8px] font-bold uppercase tracking-wider text-slate-400/90">
        <span>WC26</span>
        <span className="flex items-center gap-1">
          {isCaptain && (
            <span className="rounded bg-amber-500/90 px-1 py-0.5 text-[7px] font-black text-black">C</span>
          )}
          <span className="rounded bg-black/25 px-1 py-0.5 text-[7px] text-white/90">{badge}</span>
        </span>
      </div>
      <div className="px-2 pb-3 text-center">
        <div className="flex justify-center mb-1">
          <FlagImage
            src={getFlagSrc(player.team)}
            alt=""
            className="h-8 w-12 rounded-sm object-cover ring-1 ring-white/20"
          />
        </div>
        <p className="text-[10px] font-bold text-slate-100 leading-tight line-clamp-2 min-h-[2rem]">{player.name}</p>
        <p className="text-[9px] text-slate-400 mt-0.5 truncate">{player.team}</p>
        <p className="text-[9px] text-slate-500 mt-1 tabular-nums">
          #{shirt} · GP {gp}
        </p>
        <div className="mt-2 grid grid-cols-4 gap-0.5 text-[8px] text-slate-400">
          <span>G {player.goals}</span>
          <span>A {player.assists}</span>
          {(player.position === "gk" || player.position === "df") && <span>CS {player.clean_sheets}</span>}
          <span>MVP {player.mvp}</span>
        </div>
      </div>
    </div>
  )
}
