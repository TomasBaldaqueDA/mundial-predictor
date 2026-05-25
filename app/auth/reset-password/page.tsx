"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import { validatePasswordLength, MIN_PASSWORD_LENGTH } from "@/lib/auth-password"
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
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setAuthed(!!user))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const pwdError = validatePasswordLength(pwd)
    if (pwdError) {
      setError(pwdError)
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
      <main className="auth-card glass text-center space-y-4">
        <h1 className="page-title text-2xl">Reset link expired</h1>
        <p className="page-description mx-auto">
          The recovery link has already been used or is no longer valid. Request a new one from the login page.
        </p>
        <Link href="/login" className="btn-primary inline-flex">
          Back to log in
        </Link>
      </main>
    )
  }

  if (done) {
    return (
      <main className="auth-card glass text-center space-y-3">
        <h1 className="page-title text-2xl">Password updated</h1>
        <p className="page-description">Redirecting you home…</p>
      </main>
    )
  }

  return (
    <main className="auth-card glass">
      <h1 className="page-title text-2xl mb-2">Set a new password</h1>
      <p className="page-description mb-6">Choose a new password (at least {MIN_PASSWORD_LENGTH} characters).</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="pwd" className="label-field">
            New password
          </label>
          <input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="label-field">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-sm text-red-200 rounded-lg bg-red-500/15 border border-red-400/30 px-3 py-2" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  )
}
