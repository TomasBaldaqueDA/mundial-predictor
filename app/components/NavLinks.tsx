"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const links = [
  { href: "/jogos", label: "Games" },
  { href: "/leagues", label: "Leagues", activeAlso: ["/ranking"] },
  { href: "/groups", label: "Groups" },
  { href: "/five-a-side", label: "5-A-Side" },
  { href: "/perguntas", label: "Questions" },
  { href: "/rules", label: "Rules" },
  { href: "/profile", label: "Profile", isProfile: true },
]

export function NavLinks() {
  const pathname = usePathname()
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!signedIn) return null

  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
      {links.map((link) => {
        const { href, label, isProfile } = link
        const also = "activeAlso" in link && link.activeAlso ? link.activeAlso : []
        const active =
          pathname === href ||
          also.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
          (href !== "/" && pathname.startsWith(href + "/"))
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            className={`rounded-xl px-2.5 py-1.5 text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap ${
              active
                ? "bg-wc-gold/15 text-wc-gold border border-wc-gold/25 shadow-[0_0_12px_rgba(240,180,41,0.15)]"
                : "text-white/70 hover:text-white hover:bg-white/8 border border-transparent"
            }`}
          >
            {isProfile ? (
              <span className="inline-flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            ) : (
              label
            )}
          </Link>
        )
      })}
    </nav>
  )
}
