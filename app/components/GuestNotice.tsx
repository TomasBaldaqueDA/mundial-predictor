"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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
    <div className="alert-banner mb-8">
      <p className="text-sm text-slate-200 leading-relaxed">
        Sign up to predict scores, join leagues, and appear on the ranking.
      </p>
      <div className="flex gap-2 shrink-0">
        <Link href="/register" className="btn-primary text-sm py-2 px-4">
          Sign up
        </Link>
        <Link href="/login" className="btn-secondary text-sm py-2 px-4">
          Log in
        </Link>
      </div>
    </div>
  )
}
