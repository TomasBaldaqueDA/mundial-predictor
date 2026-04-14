"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ProfilePage() {
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? "")
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single()
      setDisplayName(profile?.display_name ?? "")
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setSaving(false)
      setMessage({ type: "error", text: "Display name cannot be empty." })
      return
    }
    // Check uniqueness (case-insensitive) excluding current user
    const { data: nameRows, error: nameCheckError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("display_name", trimmedName)
      .neq("id", user.id)
      .limit(1)
    if (nameCheckError) {
      setSaving(false)
      setMessage({ type: "error", text: "Could not verify display name. Please try again." })
      return
    }
    if (nameRows && nameRows.length > 0) {
      setSaving(false)
      setMessage({ type: "error", text: "This display name is already taken. Please choose another one." })
      return
    }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmedName })
      .eq("id", user.id)
    setSaving(false)
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "ok", text: "Profile updated." })
    }
  }

  if (loading) {
    return (
      <main>
        <p className="text-stone-500">Loading profile…</p>
      </main>
    )
  }

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">Profile</h1>
        <Link href="/" className="rounded-xl px-3 py-2 text-stone-600 hover:text-wc-gold hover:bg-wc-gold-light/30 text-sm font-medium transition-all">
          ← Back to home
        </Link>
      </div>
      <div className="max-w-md glass rounded-2xl p-6 border-wc-gold/20">
        {email && (
          <p className="text-stone-700 mb-6 text-base rounded-lg bg-stone-50 px-4 py-3">
            <span className="font-semibold">Email:</span> {email}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-stone-700 mb-1.5">
              Display name
            </label>
            <p className="text-xs text-stone-500 mb-2">
              This name is shown when you make predictions and in the ranking.
            </p>
            <input
              id="display_name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-wc-gold/50 focus:border-wc-gold bg-stone-50/50"
              placeholder="Your name"
            />
          </div>
          {message && (
            <p
              className={`text-sm rounded-lg px-3 py-2 ${message.type === "ok" ? "text-wc-green bg-wc-green-light/50" : "text-red-600 bg-red-50"}`}
              role="alert"
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-6 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </main>
  )
}
