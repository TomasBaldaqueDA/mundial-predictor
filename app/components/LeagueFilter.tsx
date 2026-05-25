"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type League = { id: string; name: string }

export function LeagueFilter({ currentLeagueId }: { currentLeagueId?: string }) {
  const [leagues, setLeagues] = useState<League[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("private_leagues")
        .select("id, name")
        .order("name")
      setLeagues((data as League[]) ?? [])
    }
    load()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  if (leagues.length === 0) return null

  const active = leagues.find((l) => l.id === currentLeagueId)

  function select(leagueId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (leagueId) {
      params.set("league", leagueId)
    } else {
      params.delete("league")
    }
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ background: active ? "rgba(240,180,41,0.2)" : "#1e293b" }}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wc-gold/40 ${
          active
            ? "border-wc-gold/60 text-wc-gold"
            : "border-slate-600 text-white hover:border-slate-400"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="max-w-[120px] truncate">{active ? active.name : "All players"}</span>
        <svg className="w-3 h-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute right-0 z-50 mt-1.5 min-w-[160px] rounded-xl border border-white/15 bg-slate-900 py-1 shadow-xl shadow-black/60 ring-1 ring-white/8"
          role="listbox"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!active}
              onClick={() => select("")}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                !active ? "bg-wc-gold/15 text-wc-gold font-semibold" : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              All players
            </button>
          </li>
          {leagues.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                role="option"
                aria-selected={l.id === currentLeagueId}
                onClick={() => select(l.id)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  l.id === currentLeagueId
                    ? "bg-wc-gold/15 text-wc-gold font-semibold"
                    : "text-slate-100 hover:bg-white/8 hover:text-white"
                }`}
              >
                {l.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
