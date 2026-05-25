"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  computeGlobalRanking,
  computeMemberRanking,
  rankPosition,
} from "@/lib/compute-member-ranking"

type LeagueRow = {
  id: string
  name: string
  invite_code: string
  owner_id: string
  created_at: string
}

function RankBadge({ rank, total }: { rank: number; total: number }) {
  return (
    <span className="text-xs font-bold text-wc-gold tabular-nums shrink-0">
      #{rank} of {total}
    </span>
  )
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<LeagueRow[]>([])
  const [loading, setLoading] = useState(true)
  const [ranksLoading, setRanksLoading] = useState(true)
  const [globalRank, setGlobalRank] = useState<{ rank: number; total: number } | null>(null)
  const [leagueRanks, setLeagueRanks] = useState<Record<string, { rank: number; total: number }>>({})
  const [name, setName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  async function loadRanks(userId: string, leagueList: LeagueRow[]) {
    setRanksLoading(true)
    const supabase = createClient()
    try {
      const global = await computeGlobalRanking(supabase)
      setGlobalRank(rankPosition(global, userId))

      const ranks: Record<string, { rank: number; total: number }> = {}
      await Promise.all(
        leagueList.map(async (l) => {
          const { data: mem } = await supabase
            .from("private_league_members")
            .select("user_id")
            .eq("league_id", l.id)
          const ids = [...new Set((mem ?? []).map((m: { user_id: string }) => m.user_id))]
          const ranked = await computeMemberRanking(supabase, ids)
          const pos = rankPosition(ranked, userId)
          if (pos) ranks[l.id] = pos
        })
      )
      setLeagueRanks(ranks)
    } finally {
      setRanksLoading(false)
    }
  }

  const refresh = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLeagues([])
      setGlobalRank(null)
      setLeagueRanks({})
      setLoading(false)
      setRanksLoading(false)
      return
    }
    const { data, error } = await supabase
      .from("private_leagues")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      console.error("refresh leagues error:", error)
    }
    const list = (data as LeagueRow[]) ?? []
    setLeagues(list)
    setLoading(false)
    void loadRanks(user.id, list)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(t)
  }, [refresh])

  async function createLeague(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const n = name.trim()
    if (n.length < 2) {
      setMsg({ type: "error", text: "League name must be at least 2 characters." })
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMsg({ type: "error", text: "You must be logged in to create a league." })
      return
    }
    const { error } = await supabase.from("private_leagues").insert({ name: n, owner_id: user.id })
    if (error) {
      setMsg({ type: "error", text: error.message })
      return
    }
    setName("")
    setMsg({ type: "ok", text: `League "${n}" created!` })
    await refresh()
  }

  async function joinLeague(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const code = joinCode.trim()
    if (!code) return
    const supabase = createClient()
    const { data, error } = await supabase.rpc("join_private_league", { p_code: code })
    if (error) {
      setMsg({ type: "error", text: error.message })
      return
    }
    setJoinCode("")
    setMsg({ type: "ok", text: "Joined league!" })
    await refresh()
    if (data) window.location.href = `/leagues/${data}`
  }

  return (
    <main className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gradient-hero [font-family:var(--font-outfit)] mb-2">
          Leagues
        </h1>
        <p className="page-intro-on-stadium text-sm leading-relaxed max-w-xl">
          Global ranking and private groups — create a mini league, share an invite code, and compare points with friends.
        </p>
      </div>

      <Link
        href="/ranking"
        className="card-on-stadium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border-2 border-wc-gold/45 px-5 py-4 hover:border-wc-gold/65 transition-colors"
      >
        <div>
          <p className="text-lg font-black text-wc-gold tracking-tight drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">Global</p>
          <p className="page-intro-on-stadium text-xs mt-1 opacity-95">Worldwide leaderboard — all players, all matches.</p>
          {!ranksLoading && globalRank && (
            <p className="text-sm font-semibold text-wc-gold/90 mt-2 tabular-nums">
              Your position: #{globalRank.rank} of {globalRank.total}
            </p>
          )}
        </div>
        <span className="text-sm font-bold text-wc-gold shrink-0">Open ranking →</span>
      </Link>

      <form onSubmit={createLeague} className="glass rounded-2xl p-5 border border-cyan-400/15 space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Create league</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="League name"
          className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/25 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
        />
        <button type="submit" className="btn-primary w-full py-2.5 text-sm">
          Create
        </button>
      </form>

      <form onSubmit={joinLeague} className="glass rounded-2xl p-5 border border-cyan-400/15 space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Join with code</h2>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          placeholder="Invite code"
          className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/25 bg-slate-900/70 text-slate-100 font-mono tracking-widest placeholder:text-slate-500"
        />
        <button type="submit" className="w-full py-2.5 rounded-xl border-2 border-wc-gold/45 font-semibold text-wc-gold hover:bg-white/8 transition-colors text-sm">
          Join league
        </button>
      </form>

      {msg && (
        <p className={`text-sm rounded-xl px-4 py-2 border ${msg.type === "ok" ? "text-emerald-300 bg-emerald-950/40 border-emerald-500/30" : "text-amber-200/90 bg-amber-950/40 border-amber-500/30"}`}>
          {msg.text}
        </p>
      )}

      <section>
        <h2 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-3">Your leagues</h2>
        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : leagues.length === 0 ? (
          <p className="text-white/40 text-sm">You’re not in any league yet.</p>
        ) : (
          <ul className="space-y-2">
            {leagues.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/leagues/${l.id}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 glass-dark rounded-xl px-4 py-3 border border-white/10 hover:border-wc-gold/25 transition-colors"
                >
                  <span className="font-semibold text-white">{l.name}</span>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {!ranksLoading && leagueRanks[l.id] && (
                      <RankBadge rank={leagueRanks[l.id].rank} total={leagueRanks[l.id].total} />
                    )}
                    <span className="text-xs font-mono text-wc-gold/80">Code: {l.invite_code}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
