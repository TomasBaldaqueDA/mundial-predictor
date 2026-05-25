"use client"

import Link from "next/link"
import { useState } from "react"

const STEPS = [
  { id: "profile", label: "Set your display name", href: "/profile" },
  { id: "league", label: "Join or create a private league", href: "/leagues" },
  { id: "predict", label: "Save your first match prediction", href: "/games" },
  { id: "rules", label: "Read scoring rules", href: "/rules" },
] as const

const STORAGE_KEY = "wc26_onboarding_dismissed"

function readDismissed(): boolean {
  if (typeof window === "undefined") return true
  try {
    return localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(readDismissed)

  if (dismissed) return null

  return (
    <section className="glass rounded-2xl border border-white/10 p-5 mb-6" aria-labelledby="onboarding-heading">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 id="onboarding-heading" className="text-sm font-bold text-slate-100 uppercase tracking-wider">
          Get started
        </h2>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1")
            } catch {
              /* ignore */
            }
            setDismissed(true)
          }}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Dismiss
        </button>
      </div>
      <ol className="space-y-2 list-decimal list-inside text-sm text-slate-300">
        {STEPS.map((step) => (
          <li key={step.id}>
            <Link href={step.href} className="text-wc-gold hover:underline ml-1">
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
