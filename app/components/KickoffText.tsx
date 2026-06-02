"use client"

import { useEffect, useState } from "react"
import { formatKickoffInBrowserTimezone } from "@/lib/format-kickoff"

type Props = {
  kickoff: string
  className?: string
}

/**
 * Renders kickoff in the viewer's browser timezone (avoids SSR/client hydration mismatch).
 */
export function KickoffText({ kickoff, className }: Props) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    setLabel(formatKickoffInBrowserTimezone(kickoff))
  }, [kickoff])

  return (
    <time className={className} dateTime={kickoff} suppressHydrationWarning>
      {label}
    </time>
  )
}
