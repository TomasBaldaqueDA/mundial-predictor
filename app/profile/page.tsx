"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Treat `_` and `%` as literal characters when checking display-name uniqueness
// (Supabase ilike still treats them as wildcards otherwise).
function escapeIlike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&")
}

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteErr, setDeleteErr] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setEmail(user.email ?? "")
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle()
      setDisplayName(profile?.display_name ?? "")
      setLoading(false)
    }
    load()
  }, [])

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNameMsg(null)
    setSavingName(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSavingName(false)
      return
    }
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setSavingName(false)
      setNameMsg({ type: "error", text: "Display name cannot be empty." })
      return
    }
    const { data: nameRows, error: nameCheckError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("display_name", escapeIlike(trimmedName))
      .neq("id", user.id)
      .limit(1)
    if (nameCheckError) {
      setSavingName(false)
      setNameMsg({ type: "error", text: "Could not verify display name. Please try again." })
      return
    }
    if (nameRows && nameRows.length > 0) {
      setSavingName(false)
      setNameMsg({ type: "error", text: "This display name is already taken. Please choose another one." })
      return
    }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmedName })
      .eq("id", user.id)
    setSavingName(false)
    if (error) {
      setNameMsg({ type: "error", text: friendlyAuthError(error.message) })
    } else {
      setNameMsg({ type: "ok", text: "Profile updated." })
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg(null)
    if (newPwd.length < 6) {
      setPwdMsg({ type: "error", text: "Password must be at least 6 characters." })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "Passwords do not match." })
      return
    }
    setSavingPwd(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setSavingPwd(false)
    if (error) {
      setPwdMsg({ type: "error", text: friendlyAuthError(error.message) })
      return
    }
    setNewPwd("")
    setConfirmPwd("")
    setPwdMsg({ type: "ok", text: "Password updated." })
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function handleDeleteAccount() {
    setDeleteErr(null)
    setDeleting(true)
    try {
      const res = await fetch("/api/account/delete", { method: "POST" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setDeleting(false)
        setDeleteErr(friendlyAuthError(body?.error ?? "Could not delete account."))
        return
      }
      // The session cookie is now invalid; force a hard reload to clear state.
      window.location.href = "/"
    } catch {
      setDeleting(false)
      setDeleteErr("Network problem. Please try again.")
    }
  }

  if (loading) {
    return (
      <main>
        <p className="text-white/50">Loading profile…</p>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">Profile</h1>
        <Link
          href="/"
          className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
        >
          ← Back to home
        </Link>
      </div>

      {email && (
        <div className="max-w-md glass rounded-2xl p-5 border border-cyan-400/20 shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
          <p className="text-slate-100 font-medium break-all">{email}</p>
        </div>
      )}

      <form onSubmit={handleNameSubmit} className="max-w-md glass rounded-2xl p-6 border border-cyan-400/20 shadow-xl space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-emerald-300">Display name</h2>
          <p className="text-xs text-slate-400 mt-1">
            Shown when you make predictions and in the ranking.
          </p>
        </div>
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Name
          </label>
          <input
            id="display_name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="Your name"
          />
        </div>
        {nameMsg && (
          <p
            className={`text-sm rounded-lg px-3 py-2 border ${
              nameMsg.type === "ok"
                ? "text-emerald-200 bg-emerald-500/15 border-emerald-400/30"
                : "text-red-200 bg-red-500/15 border-red-400/30"
            }`}
            role="alert"
          >
            {nameMsg.text}
          </p>
        )}
        <button
          type="submit"
          disabled={savingName}
          className="w-full py-3 px-4 bg-wc-gold text-white font-semibold rounded-xl hover:bg-wc-gold-dark disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {savingName ? "Saving…" : "Save name"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="max-w-md glass rounded-2xl p-6 border border-cyan-400/20 shadow-xl space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-emerald-300">Change password</h2>
          <p className="text-xs text-slate-400 mt-1">At least 6 characters.</p>
        </div>
        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-slate-300 mb-1.5">
            New password
          </label>
          <input
            id="new_password"
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirm_password"
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        {pwdMsg && (
          <p
            className={`text-sm rounded-lg px-3 py-2 border ${
              pwdMsg.type === "ok"
                ? "text-emerald-200 bg-emerald-500/15 border-emerald-400/30"
                : "text-red-200 bg-red-500/15 border-red-400/30"
            }`}
            role="alert"
          >
            {pwdMsg.text}
          </p>
        )}
        <button
          type="submit"
          disabled={savingPwd}
          className="w-full py-3 px-4 bg-wc-gold text-white font-semibold rounded-xl hover:bg-wc-gold-dark disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {savingPwd ? "Updating…" : "Update password"}
        </button>
      </form>

      <div className="max-w-md">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-2.5 px-4 rounded-xl border border-white/15 text-slate-300 hover:text-wc-gold hover:bg-white/8 font-medium text-sm transition-all"
        >
          Log out
        </button>
      </div>

      <div className="max-w-md glass rounded-2xl p-6 border border-red-500/25 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-red-200">Delete account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Permanently removes your profile, predictions, group picks, special answers and 5-A-SIDE
            team. This cannot be undone.
          </p>
        </div>
        {deleteErr && (
          <p
            role="alert"
            className="text-sm text-red-200 rounded-lg bg-red-500/15 border border-red-400/30 px-3 py-2"
          >
            {deleteErr}
          </p>
        )}
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-red-400/40 text-red-200 hover:bg-red-500/10 font-medium text-sm transition-all"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-200">
              Are you sure? This is permanent.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/85 hover:bg-red-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete forever"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="py-2.5 px-4 rounded-xl border border-white/15 text-slate-300 hover:bg-white/8 font-medium text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
