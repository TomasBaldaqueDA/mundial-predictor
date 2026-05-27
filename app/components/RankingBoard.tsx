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
      <div className="leaderboard-shell">
        <div className="leaderboard-header">
          <div className="text-center">#</div>
          <div className="pl-1">Player</div>
          <div className="text-right hidden sm:block">Games</div>
          <div className="text-right hidden sm:block">Quest.</div>
          <div className="text-right hidden sm:block">Groups</div>
          <div className="text-right hidden sm:block">5-A-Side</div>
          <div className="text-right text-wc-gold/80 sm:col-auto col-start-3 row-start-1">Total</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {rows.map((row, index) => {
            const isMe = currentUserId === row.userId
            return (
              <div
                key={row.userId}
                id={rankRowId(row.userId)}
                className={isMe ? "rank-highlight scroll-mt-28" : "scroll-mt-28"}
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
