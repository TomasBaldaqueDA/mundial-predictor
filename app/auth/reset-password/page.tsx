"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [pwd, setPwd] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    // After Supabase emails the recovery link, the magic-link callback hands
    // us a temporary session. If there's no session here, the user landed on
    // this page directly without a recovery link — bounce them to /login.
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setAuthed(!!user))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (pwd.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (pwd !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password: pwd })
    setLoading(false)
    if (err) {
      setError(friendlyAuthError(err.message))
      return
    }
    setDone(true)
    setTimeout(() => router.push("/"), 1500)
  }

  if (authed === false) {
    return (
      <main className="max-w-md mx-auto glass rounded-2xl p-8 border border-cyan-400/20 shadow-xl space-y-4 text-center">
        <h1 className="text-2xl font-bold text-emerald-300">Reset link expired</h1>
        <p className="text-slate-400">
          The recovery link has already been used or is no longer valid. Request a new one from the login page.
        </p>
        <Link href="/login" className="inline-block rounded-xl px-4 py-2 text-wc-gold font-medium hover:bg-white/10">
          Back to log in
        </Link>
      </main>
    )
  }

  if (done) {
    return (
      <main className="max-w-md mx-auto glass rounded-2xl p-8 border border-cyan-400/20 shadow-xl text-center space-y-3">
        <h1 className="text-2xl font-bold text-emerald-300">Password updated</h1>
        <p className="text-slate-400">Redirecting you home…</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto glass rounded-2xl p-8 border border-cyan-400/20 shadow-xl">
      <h1 className="text-2xl font-bold text-emerald-300 mb-2">Set a new password</h1>
      <p className="text-slate-400 mb-6">Choose a new password (at least 6 characters).</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="pwd" className="block text-sm font-medium text-slate-300 mb-1.5">
            New password
          </label>
          <input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-sm text-red-200 rounded-lg bg-red-500/15 border border-red-400/30 px-3 py-2" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-wc-gold text-white font-semibold rounded-xl hover:bg-wc-gold-dark disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  )
}
