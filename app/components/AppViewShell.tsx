"use client"

import Link from "next/link"
import { AppBackground } from "@/app/components/AppBackground"
import { BottomNav } from "@/app/components/BottomNav"
import { HeaderAuth } from "@/app/components/HeaderAuth"
import { NavLinks } from "@/app/components/NavLinks"

export function AppViewShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBackground />

      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#02060f]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 relative z-10">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fcd34d] via-[#e8b84a] to-[#38bdf8] flex flex-col items-center justify-center leading-none ring-1 ring-white/20">
              <span className="text-[#1a0f00] font-black text-[8px] tracking-tight [font-family:var(--font-outfit)] leading-none">
                WC
              </span>
              <span className="text-[#1a0f00] font-black text-[12px] tracking-tighter [font-family:var(--font-outfit)] leading-none -mt-0.5">
                26
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-[15px] font-bold tracking-tight text-white group-hover:text-wc-gold transition-colors [font-family:var(--font-outfit)]">
                WC26 Predictor
              </span>
              <span className="block text-[10px] font-semibold text-white/35 uppercase tracking-[0.2em] -mt-0.5">
                World Cup 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 justify-end min-w-0 flex-1">
            <div className="hidden sm:flex min-w-0">
              <NavLinks />
            </div>
            <HeaderAuth />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-28 sm:pb-20 animate-fade-in-soft relative z-10">
        {children}
      </div>

      <footer className="hidden sm:block relative z-10 border-t border-white/[0.06] bg-[#02060f]/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/35">
          <span className="[font-family:var(--font-outfit)] font-semibold tracking-wide text-white/50">
            WC26 Predictor
          </span>
          <div className="flex flex-wrap gap-4">
            <Link href="/rules" className="hover:text-wc-gold transition-colors">
              Rules
            </Link>
            <Link href="/ranking" className="hover:text-wc-gold transition-colors">
              Ranking
            </Link>
            <Link href="/leagues" className="hover:text-wc-gold transition-colors">
              Leagues
            </Link>
          </div>
        </div>
      </footer>

      <BottomNav />
    </>
  )
}
