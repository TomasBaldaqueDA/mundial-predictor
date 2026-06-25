"use client"

import { getFlagSrc } from "@/lib/team-flags"
import { FlagImage } from "@/app/components/FlagImage"

type TeamWithFlagProps = {
  name: string | null | undefined
  className?: string
  flagSize?: "w40" | "w80" | "w160" | "w320"
  /** Larger text + flag for match cards */
  size?: "md" | "lg" | "xl"
  /** Use onLight on pale backgrounds (default onDark = light text for dark UI). */
  variant?: "onDark" | "onLight"
  suffix?: string
  /** When false, long names wrap instead of ellipsis. Default true. */
  truncate?: boolean
}

export function TeamWithFlag({
  name,
  className = "",
  flagSize = "w80",
  size = "md",
  variant = "onDark",
  suffix = "",
  truncate = true,
}: TeamWithFlagProps) {
  const n = (name ?? "").trim()
  if (!n) return <span className={className}>—</span>

  const ringClass = variant === "onLight" ? "ring-black/10" : "ring-white/10"
  const imgClass =
    size === "xl"
      ? `h-8 w-12 shrink-0 rounded object-cover ring-1 ${ringClass}`
      : size === "lg"
        ? `h-7 w-11 sm:h-8 sm:w-[3.25rem] shrink-0 rounded object-cover ring-1 ${ringClass}`
        : variant === "onLight"
          ? `h-4 w-6 shrink-0 rounded object-cover ring-1 ${ringClass}`
          : "h-4 w-6 shrink-0 rounded object-cover"

  const flagSrcSize =
    size === "xl" ? "w320" : size === "lg" ? "w320" : flagSize

  const clipClass = truncate ? "truncate" : "break-words [overflow-wrap:anywhere]"
  const textColor = variant === "onLight" ? "text-stone-900" : "text-slate-100"
  const textClass =
    size === "xl"
      ? `font-medium ${textColor} text-lg leading-snug min-w-0 ${clipClass}`
      : size === "lg"
        ? `font-semibold ${textColor} text-base sm:text-lg leading-snug min-w-0 ${clipClass}`
        : `text-sm font-medium ${textColor} leading-snug min-w-0 ${clipClass}`

  return (
    <span
      className={`inline-flex gap-2 min-w-0 max-w-full ${truncate ? "items-center" : "items-start"} ${className}`}
    >
      <FlagImage src={getFlagSrc(n, flagSrcSize)} alt="" className={imgClass} />
      <span className={textClass}>
        {n}
        {suffix}
      </span>
    </span>
  )
}
