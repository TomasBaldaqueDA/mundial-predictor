import Link from "next/link"
import { playerProfilePath } from "@/lib/tournament"

type Props = {
  userId: string | null | undefined
  name: string
  className?: string
  /** Stop parent row/button from toggling when name is inside a clickable row */
  stopPropagation?: boolean
}

export function PlayerNameLink({ userId, name, className = "", stopPropagation = false }: Props) {
  if (!userId) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link
      href={playerProfilePath(userId)}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className={`hover:text-wc-gold hover:underline underline-offset-2 transition-colors ${className}`}
    >
      {name}
    </Link>
  )
}
