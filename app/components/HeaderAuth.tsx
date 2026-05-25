"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeaderAuth() {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    router.push("/")
    router.refresh()
  }

  if (loading) return <div className="w-16 h-7 rounded-xl bg-white/5 animate-pulse" />

  if (displayName) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="hidden sm:inline-flex items-center justify-center rounded-xl w-8 h-8 text-white/70 hover:text-wc-gold hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-200"
          title={displayName ?? "Your profile"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="rounded-xl px-3 py-1.5 text-white/55 hover:text-red-300 hover:bg-red-500/10 font-medium text-[12.5px] transition-all duration-200 border border-transparent hover:border-red-500/20"
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-xl px-3 py-1.5 text-white/80 hover:text-wc-gold hover:bg-white/8 font-medium text-[13px] transition-all duration-200"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-xl px-3 py-1.5 bg-wc-gold text-[#1a0f00] hover:bg-wc-gold-dark font-semibold text-[13px] transition-all duration-200 shadow-[0_2px_12px_rgba(240,180,41,0.4)]"
      >
        Sign up
      </Link>
    </div>
  )
}
