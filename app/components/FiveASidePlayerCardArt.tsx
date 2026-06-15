import Image from "next/image"
import { getFiveASideCardSrc } from "@/lib/five-a-side-images"

type Props = {
  team: string
  name: string
  size?: "default" | "mini" | "hero"
  className?: string
}

/** Shared lineup grid: 5 equal columns on sm+, horizontal scroll on very small screens. */
export const LINEUP_GRID_CLASS =
  "relative max-sm:flex max-sm:overflow-x-auto max-sm:gap-3 max-sm:px-4 max-sm:pb-3 max-sm:snap-x max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-5 sm:gap-2 lg:gap-3 p-4 sm:p-5 max-w-6xl sm:mx-auto"

export const LINEUP_SLOT_CLASS =
  "flex flex-col items-center gap-2 w-full min-w-0 max-sm:shrink-0 max-sm:w-[9.25rem] max-sm:snap-center"

export function FiveASidePlayerCardArt({ team, name, size = "default", className = "" }: Props) {
  const src = getFiveASideCardSrc(team, name)
  if (!src) return null

  if (size === "hero") {
    return (
      <div className={`relative w-full aspect-[3/2] overflow-hidden bg-[#0a1020] ${className}`}>
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 148px, (max-width: 1024px) 160px, 200px"
          className="object-cover object-[center_40%] scale-[1.14]"
          draggable={false}
        />
      </div>
    )
  }

  if (size === "mini") {
    return (
      <div className={`relative aspect-[3/2] w-12 shrink-0 overflow-hidden rounded bg-[#0a1020] ${className}`}>
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="48px"
          className="object-cover object-[center_40%] scale-[1.14]"
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-[3/2] overflow-hidden rounded-lg bg-[#0a1020] ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 640px) 148px, 200px"
        className="object-cover object-[center_40%] scale-[1.14]"
        draggable={false}
      />
    </div>
  )
}
