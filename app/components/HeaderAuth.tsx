"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "?"
}

export function HeaderAuth() {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setDisplayName(null)
        setLoading(false)
        return
      }
      void supabase
        .from("profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .maybeSingle()
        .then(({ data: profile }) => {
          setDisplayName(profile?.display_name ?? session.user.email?.split("@")[0] ?? "You")
          setLoading(false)
        })
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.assign("/")
  }

  if (loading) {
    return <div className="w-24 h-9 rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.06]" />
  }

  if (displayName) {
    const initials = avatarInitials(displayName)
    return (
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/profile"
          className="hidden sm:flex items-center gap-2 rounded-xl pl-1 pr-2.5 py-1 border border-transparent hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200 group"
          title={displayName}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-wc-gold/90 to-amber-600 flex items-center justify-center text-[11px] font-bold text-[#1a0f00] ring-1 ring-white/20 shadow-[0_2px_12px_rgba(232,184,74,0.35)]">
            {initials}
          </span>
          <span className="text-[13px] font-semibold text-white/80 max-w-[7rem] truncate group-hover:text-wc-gold transition-colors">
            {displayName}
          </span>
        </Link>
        <button type="button" onClick={signOut} className="btn-ghost text-white/50 hover:text-red-300 hover:border-red-500/20 hover:bg-red-500/10">
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link href="/login" className="btn-ghost">
        Log in
      </Link>
      <Link href="/register" className="btn-primary text-[13px] py-2 px-4">
        Sign up
      </Link>
    </div>
  )
}
