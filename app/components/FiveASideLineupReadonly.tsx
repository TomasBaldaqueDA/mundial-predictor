"use client"

import { useMemo } from "react"
import { FlagImage } from "@/app/components/FlagImage"
import { FiveASidePlayerCardArt, LINEUP_GRID_CLASS, LINEUP_SLOT_CLASS } from "@/app/components/FiveASidePlayerCardArt"
import { getFlagSrc } from "@/lib/team-flags"
import { hasFiveASideCard } from "@/lib/five-a-side-images"
import {
  LINEUP_SLOTS,
  pickIdForSlot,
  slotFantasyPoints,
  supersubInDeltaDisplay,
  supersubOutFrozenDisplay,
  type FiveASidePicks,
  type FiveASidePlayer,
  type SlotKey,
} from "@/lib/five-a-side"
import { squadShirtNumbers } from "@/lib/team-kit"

type Props = {
  picks: FiveASidePicks
  players: FiveASidePlayer[]
}

export function FiveASideLineupReadonly({ picks, players }: Props) {
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

      <div className="relative rounded-3xl border border-cyan-400/15 bg-gradient-to-b from-[#121a2e] via-[#0a1020] to-[#020617] shadow-[0_4px_32px_rgba(0,0,0,0.48)]">
        <div className={LINEUP_GRID_CLASS}>
          {LINEUP_SLOTS.map(({ slot, badge, label }) => {
            const player = getPlayer(slot)
            const points = slotFantasyPoints(picks, slot, playersById)
            const supersubOnSlot = supersubApplied && picks.supersub_slot === slot
            const subbedOut = supersubOnSlot ? supersubOutFrozenDisplay(picks, playersById) : null
            const subbedIn = supersubOnSlot ? supersubInDeltaDisplay(picks, playersById) : null
            const displayPlayer = subbedIn?.player ?? player
            const shirt = player ? (shirtNumberByPlayerId.get(player.id) ?? 1) : 0
            const isCaptain = !!(player && captainId === player.id)
            const wasSubbedOut =
              supersubApplied && picks.supersub_slot === slot && picks.supersub_out_player_id === captainId
            const showCardArt = !!(displayPlayer && hasFiveASideCard(displayPlayer.team, displayPlayer.name))
            return (
              <div key={slot} className={LINEUP_SLOT_CLASS}>
                {subbedOut && (
                  <>
                    <ReadonlyMiniCard
                      player={subbedOut.player}
                      badge={badge}
                      shirt={shirtNumberByPlayerId.get(subbedOut.player.id) ?? 1}
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
                  className={`w-full min-w-0 overflow-hidden rounded-xl border-2 bg-[#0a1020] ${
                    showCardArt ? "border-cyan-400/30" : "border-cyan-400/22 bg-gradient-to-b from-[#28344e]/95 to-[#0e1628]"
                  } ${supersubOnSlot ? "ring-1 ring-cyan-400/20" : ""}`}
                >
                  {!showCardArt && (
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
                  )}
                  {displayPlayer ? (
                    <div className={showCardArt ? "" : "px-2 pb-3 text-center"}>
                      {showCardArt && (
                        <div className="relative">
                          <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
                            {isCaptain && (
                              <span className="rounded bg-amber-500 px-1 py-0.5 text-[7px] font-black text-black shadow">C</span>
                            )}
                            {wasSubbedOut && !isCaptain && (
                              <span className="rounded bg-amber-500/40 px-1 py-0.5 text-[7px] text-amber-100">C†</span>
                            )}
                            <span className="rounded bg-black/60 px-1 py-0.5 text-[7px] font-bold text-white/95">{badge}</span>
                          </div>
                          <FiveASidePlayerCardArt team={displayPlayer.team} name={displayPlayer.name} size="hero" />
                        </div>
                      )}
                      {supersubOnSlot && !showCardArt && (
                        <p className="text-[8px] font-bold uppercase tracking-wide text-cyan-300/90 mb-1">From R32</p>
                      )}
                      {!showCardArt && (
                        <>
                          <div className="flex justify-center mb-1">
                            <FlagImage
                              src={getFlagSrc(displayPlayer.team)}
                              alt=""
                              className="h-8 w-12 rounded-sm object-cover ring-1 ring-white/20"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-100 leading-tight line-clamp-2 min-h-[2rem]">
                            {displayPlayer.name}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate">{displayPlayer.team}</p>
                          <p className="text-[9px] text-slate-500 mt-1 tabular-nums">#{shirt}</p>
                        </>
                      )}
                      <div className={showCardArt ? "border-t border-white/10 px-1 pb-2" : ""}>
                        <PlayerStatGrid player={displayPlayer} variant={showCardArt ? "full" : "default"} badge={badge} />
                      </div>
                    </div>
                  ) : (
                    <div className="px-2 pb-4 pt-2 text-center text-[10px] text-slate-500">{label} — empty</div>
                  )}
                </div>
                {supersubOnSlot && subbedIn && (
                  <span className="text-[10px] font-black tabular-nums text-cyan-200/90 border border-cyan-400/30 rounded-full px-2 py-0.5">
                    {subbedIn.points} pts from R32
                  </span>
                )}
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
                      {points} pts{supersubOnSlot ? " slot total" : ""}
                    </>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
        <p className="pb-4 text-center text-[11px] text-slate-400 sm:hidden">Swipe to view all 5 players.</p>
      </div>
    </div>
  )
}

function PlayerStatGrid({
  player,
  variant = "default",
  badge,
}: {
  player: FiveASidePlayer
  variant?: "default" | "full"
  badge?: string
}) {
  const showCleanSheet = player.position === "gk" || player.position === "df"
  const statMuted = "text-slate-400/85"
  const statVal = "tabular-nums text-[9px] sm:text-[10px]"

  if (variant === "full") {
    return (
      <div className="py-1.5 text-center text-[7px] font-semibold uppercase leading-tight tracking-wide sm:text-[8px] text-slate-200/90">
        <div className="space-y-1">
          <div className={`grid gap-x-0.5 ${showCleanSheet ? "grid-cols-4" : "grid-cols-3"}`}>
            <div className="min-w-0"><div className={statMuted}>G</div><div className={statVal}>{player.goals}</div></div>
            <div className="min-w-0"><div className={statMuted}>A</div><div className={statVal}>{player.assists}</div></div>
            {showCleanSheet && (
              <div className="min-w-0"><div className={statMuted}>CS</div><div className={statVal}>{player.clean_sheets}</div></div>
            )}
            <div className="min-w-0"><div className={statMuted}>MVP</div><div className={statVal}>{player.mvp}</div></div>
          </div>
          <div className="grid grid-cols-4 gap-x-0.5">
            <div className="min-w-0"><div className={statMuted}>GP</div><div className={statVal}>{player.games_played}</div></div>
            <div className="min-w-0"><div className={statMuted}>W</div><div className={statVal}>{player.wins}</div></div>
            <div className="min-w-0"><div className={statMuted}>Pos</div><div className="text-[9px] sm:text-[10px] leading-none">{badge}</div></div>
            <div className="flex min-w-0 flex-col items-center justify-start">
              <div className={statMuted}>Nat</div>
              <FlagImage src={getFlagSrc(player.team)} alt="" className="mt-0.5 h-3.5 w-5 rounded-sm object-cover ring-1 ring-black/10" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mt-2 space-y-1 text-[8px] text-slate-400">
      <div className={`grid gap-0.5 ${showCleanSheet ? "grid-cols-4" : "grid-cols-3"}`}>
        <span>G {player.goals}</span>
        <span>A {player.assists}</span>
        {showCleanSheet && <span>CS {player.clean_sheets}</span>}
        <span>MVP {player.mvp}</span>
      </div>
      <div className="grid grid-cols-2 gap-0.5">
        <span>GP {player.games_played}</span>
        <span>W {player.wins}</span>
      </div>
    </div>
  )
}

function ReadonlyMiniCard({
  player,
  badge,
  shirt,
  isCaptain,
  substitutedOut,
}: {
  player: FiveASidePlayer
  badge: string
  shirt: number
  isCaptain: boolean
  substitutedOut?: boolean
}) {
  const showCardArt = hasFiveASideCard(player.team, player.name)
  return (
    <div
      className={`relative ${showCardArt ? "w-[11.5rem] sm:w-48" : "w-[9.25rem] sm:w-40"} rounded-2xl border-2 overflow-hidden scale-[0.88] opacity-50 grayscale-[0.35] ${
        substitutedOut ? "border-white/10" : "border-cyan-400/22"
      }`}
    >
      {substitutedOut && (
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-slate-900/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-300">
          OUT
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
        <div className="flex justify-center mb-1 px-0.5">
          {showCardArt ? (
            <FiveASidePlayerCardArt team={player.team} name={player.name} />
          ) : (
            <FlagImage
              src={getFlagSrc(player.team)}
              alt=""
              className="h-8 w-12 rounded-sm object-cover ring-1 ring-white/20"
            />
          )}
        </div>
        {!showCardArt && (
          <>
            <p className="text-[10px] font-bold text-slate-100 leading-tight line-clamp-2 min-h-[2rem]">{player.name}</p>
            <p className="text-[9px] text-slate-400 mt-0.5 truncate">{player.team}</p>
            <p className="text-[9px] text-slate-500 mt-1 tabular-nums">#{shirt}</p>
          </>
        )}
        <PlayerStatGrid player={player} />
      </div>
    </div>
  )
}
