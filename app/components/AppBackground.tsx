"use client"

import type { CSSProperties } from "react"
import { usePathname } from "next/navigation"

type AppBgKey =
  | "home"
  | "perguntas"
  | "leagues"
  | "groups"
  | "five"
  | "matches"
  | "predict"
  | "ranking"
  | "rules"
  | "account"

function pathnameToBgKey(pathname: string): AppBgKey {
  const p = pathname || "/"
  if (p === "/") return "home"
  if (p.startsWith("/perguntas")) return "perguntas"
  if (p.startsWith("/leagues")) return "leagues"
  if (p.startsWith("/groups")) return "groups"
  if (p.startsWith("/five-a-side")) return "five"
  if (p.startsWith("/jogos") || p.startsWith("/match")) return "matches"
  if (p.startsWith("/predict")) return "predict"
  if (p.startsWith("/ranking")) return "ranking"
  if (p.startsWith("/rules")) return "rules"
  if (
    p.startsWith("/profile") ||
    p.startsWith("/login") ||
    p.startsWith("/register") ||
    p.startsWith("/auth")
  ) {
    return "account"
  }
  return "home"
}

/** Inline --stadium-photo fixes cases where the ::before layer stayed on the root fallback only. */
const STADIUM_LAYER: Partial<Record<AppBgKey, CSSProperties>> = {
  matches: { "--stadium-photo": 'url("/images/bg-games.jpg")' } as CSSProperties,
  leagues: { "--stadium-photo": 'url("/images/bg-leagues.jpg")' } as CSSProperties,
}

export function AppBackground() {
  const pathname = usePathname() ?? "/"
  const key = pathnameToBgKey(pathname)
  return (
    <div
      className={`app-bg-stadium app-bg--${key}`}
      style={STADIUM_LAYER[key]}
      aria-hidden
    />
  )
}
