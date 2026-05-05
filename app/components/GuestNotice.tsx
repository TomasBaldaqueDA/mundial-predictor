"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Shown only to unauthenticated visitors on the home page so guests know they
 * need an account before clicking around. Hidden once a session is detected.
 */
export function GuestNotice() {
  const [isGuest, setIsGuest] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsGuest(!user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsGuest(!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (isGuest !== true) return null

  return (
    <div className="mb-6 mt-2 glass rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 border border-cyan-400/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-slate-200">
        <span className="font-semibold text-wc-gold">Welcome —</span>{" "}
        create an account to predict, join leagues and climb the global ranking. Browsing without one is
        limited to this page and the rules.
      </p>
      <div className="flex gap-2 shrink-0">
        <Link
          href="/register"
          className="rounded-xl px-3 py-1.5 bg-wc-gold text-[#1a0f00] text-sm font-semibold hover:bg-wc-gold-dark transition-colors"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className="rounded-xl px-3 py-1.5 border border-white/20 text-slate-200 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  )
}
