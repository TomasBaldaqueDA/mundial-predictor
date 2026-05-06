"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import Link from "next/link"

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? ""
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(friendlyAuthError(err.message))
      return
    }
    router.push(next || "/")
    router.refresh()
  }

  async function handleGoogleSignIn() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const callback = new URL("/auth/callback", window.location.origin)
    if (next) callback.searchParams.set("next", next)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    })
    if (err) {
      setLoading(false)
      setError(friendlyAuthError(err.message))
    }
    // On success the browser is redirected to Google — no further code runs.
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Enter your email to receive a reset link.")
      return
    }
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })
    setLoading(false)
    if (err) {
      setError(friendlyAuthError(err.message))
      return
    }
    setForgotSent(true)
  }

  if (forgotSent) {
    return (
      <div className="max-w-md mx-auto glass rounded-2xl p-8 border border-cyan-400/20 shadow-xl text-center space-y-5">
        <h1 className="text-2xl font-bold text-emerald-300">Check your email</h1>
        <p className="text-slate-400">
          We sent a password reset link to <strong className="text-slate-200">{email}</strong>. Click the link to set a new password.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => { setForgotSent(false) }}
            className="rounded-xl px-4 py-2 text-wc-gold font-medium hover:bg-white/10 transition-colors"
          >
            Back to log in
          </button>
          <Link href="/" className="rounded-xl px-4 py-2 text-slate-400 hover:bg-white/8 font-medium text-sm transition-colors inline-block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto glass rounded-2xl p-8 border border-cyan-400/20 shadow-xl">
      <h1 className="text-2xl font-bold text-emerald-300 mb-2">Log in</h1>
      <p className="text-slate-400 mb-6">
        Enter your email and password.
      </p>
      {next && (
        <p className="text-sm text-slate-400 mb-4">
          After logging in you’ll be taken back to the page you requested.
        </p>
      )}
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
      <div className="relative mb-5" aria-hidden>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-[#0a1320] px-3 text-white/40">or with email</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
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
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={loading}
          className="text-sm text-slate-400 hover:text-wc-gold font-medium"
        >
          Forgot password?
        </button>
      </div>
      <p className="mt-6 pt-6 border-t border-white/10 text-sm text-slate-400 text-center">
        Don’t have an account?{" "}
        <Link href="/register" className="text-wc-gold hover:underline font-semibold">
          Create account
        </Link>
      </p>
      <Link href="/" className="mt-4 block text-center text-slate-500 hover:text-wc-gold text-sm font-medium">
        Back to home
      </Link>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto text-white/50 text-sm">Loading…</div>}>
      <LoginForm />
    </Suspense>
  )
}
