"use client"

import { RankingRow } from "@/app/ranking/RankingRow"
import { ScrollToRankRow } from "@/app/components/ScrollToRankRow"
import type { RankedRow } from "@/lib/compute-member-ranking"
import { rankRowId } from "@/lib/compute-member-ranking"

type Props = {
  rows: RankedRow[]
  currentUserId?: string | null
  scrollToUser?: boolean
}

export function RankingBoard({ rows, currentUserId, scrollToUser = true }: Props) {
  return (
    <>
      {scrollToUser && <ScrollToRankRow userId={currentUserId} />}
      <div className="glass-dark rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50">
        <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem_6rem] px-4 py-3 border-b border-white/10 bg-white/12">
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-center">#</div>
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider pl-2">Name</div>
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">
            Games
          </div>
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">
            Quest.
          </div>
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">
            Groups
          </div>
          <div className="text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right hidden sm:block">
            5-A-Side
          </div>
          <div className="text-[11px] font-semibold text-wc-gold/70 uppercase tracking-wider text-right">Total</div>
        </div>

        <div className="divide-y divide-white/5">
          {rows.map((row, index) => {
            const isMe = currentUserId === row.userId
            return (
              <div
                key={row.userId}
                id={rankRowId(row.userId)}
                className={isMe ? "ring-2 ring-inset ring-wc-gold/45 bg-wc-gold/5 scroll-mt-24" : "scroll-mt-24"}
              >
                <RankingRow row={row} index={index} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
