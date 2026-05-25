"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import { getAuthCallbackUrl, OAUTH_SIGNUP_FLOW, signOutBeforeOAuth } from "@/lib/auth-oauth"
import { validatePasswordLength, MIN_PASSWORD_LENGTH } from "@/lib/auth-password"
import Link from "next/link"

// Escape `_` and `%` so display-name uniqueness checks don't accept literal
// wildcard characters as a regex-like match.
function escapeIlike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&")
}

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setError("Please choose a display name.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    const pwdError = validatePasswordLength(password)
    if (pwdError) {
      setError(pwdError)
      return
    }
    setLoading(true)
    const supabase = createClient()
    // Check display name uniqueness before attempting sign up
    const { data: existingNameRows, error: nameCheckError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("display_name", escapeIlike(trimmedName))
      .limit(1)
    if (nameCheckError) {
      setLoading(false)
      setError("Could not verify display name. Please try again.")
      return
    }
    if (existingNameRows && existingNameRows.length > 0) {
      setLoading(false)
      setError("This display name is already taken. Please choose another one.")
      return
    }
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: trimmedName,
        },
      },
    })
    setLoading(false)
    if (err) {
      setError(friendlyAuthError(err.message))
      return
    }
    // Supabase returns user but no session when email confirmation is required.
    if (data?.user && !data.session) {
      setNeedsEmailConfirm(email)
      return
    }
    router.push("/")
    router.refresh()
  }

  if (needsEmailConfirm) {
    return (
      <div className="auth-card glass text-center space-y-5">
        <h1 className="page-title text-2xl">Check your email</h1>
        <p className="text-slate-400">
          We sent a confirmation link to <strong className="text-slate-200">{needsEmailConfirm}</strong>. Click it to
          activate your account, then log in.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl px-4 py-2 text-wc-gold font-medium hover:bg-white/10 transition-colors"
        >
          Go to log in
        </Link>
      </div>
    )
  }

  async function handleGoogleSignIn() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    await signOutBeforeOAuth(supabase)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(undefined, undefined, { flow: OAUTH_SIGNUP_FLOW }),
        queryParams: { prompt: "select_account" },
      },
    })
    if (err) {
      setLoading(false)
      setError(friendlyAuthError(err.message))
    }
  }

  return (
    <div className="auth-card glass">
      <h1 className="page-title text-2xl mb-2">Create account</h1>
      <p className="page-description mb-6">
        Enter your display name, email and choose a password (at least {MIN_PASSWORD_LENGTH} characters).
      </p>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full mb-5 inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/15 bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 disabled:opacity-60 transition-colors"
      >
        <svg viewBox="0 0 18 18" className="w-4 h-4" aria-hidden>
          <path fill="#EA4335" d="M9 3.48c1.69 0 2.85.73 3.5 1.34l2.55-2.5C13.46.84 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" />
          <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" />
          <path fill="#FBBC05" d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" />
        </svg>
        Continue with Google
      </button>
      <div className="divider-or" aria-hidden>
        <span>or with email</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="displayName" className="label-field">
            Display name
          </label>
          <p className="text-xs text-slate-500 mb-2">
            This name will appear in your predictions and in the ranking.
          </p>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="input-field"
            placeholder="Your name or nickname"
          />
        </div>
        <div>
          <label htmlFor="email" className="label-field">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label-field">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label-field">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 pt-6 border-t border-white/10 text-sm text-slate-400 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-wc-gold hover:underline font-semibold">
          Log in
        </Link>
      </p>
      <Link href="/" className="mt-4 block text-center text-slate-500 hover:text-wc-gold text-sm font-medium">
        Back to home
      </Link>
    </div>
  )
}
