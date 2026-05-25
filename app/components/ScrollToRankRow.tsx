"use client"

import { useEffect } from "react"
import { rankRowId } from "@/lib/compute-member-ranking"

type Props = {
  userId: string | null | undefined
  enabled?: boolean
}

/** Scrolls the leaderboard so the given user's row is visible (centered). */
export function ScrollToRankRow({ userId, enabled = true }: Props) {
  useEffect(() => {
    if (!enabled || !userId) return
    const timer = window.setTimeout(() => {
      const el = document.getElementById(rankRowId(userId))
      el?.scrollIntoView({ block: "center", behavior: "smooth" })
    }, 150)
    return () => window.clearTimeout(timer)
  }, [userId, enabled])

  return null
}
