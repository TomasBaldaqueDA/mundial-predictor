"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeaderAuth() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null)
      setLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) return null
  if (user) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="rounded-xl px-3 py-2 text-white/90 hover:text-wc-gold hover:bg-white/10 font-medium text-[13px] transition-all duration-200"
      >
        Log out
      </button>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-xl px-3 py-2 text-white/90 hover:text-wc-gold hover:bg-white/10 font-medium text-[13px] transition-all duration-200 inline-block"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-xl px-3 py-2 border border-white/50 text-white/90 hover:text-wc-green-dark hover:bg-white font-semibold text-[13px] transition-all duration-200 inline-block"
      >
        Sign up
      </Link>
    </div>
  )
}
