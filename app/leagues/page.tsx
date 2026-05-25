"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  computeGlobalRanking,
  computeMemberRanking,
  rankPosition,
} from "@/lib/compute-member-ranking"
import { PageHeader } from "@/app/components/PageHeader"
import { EmptyState } from "@/app/components/EmptyState"
import { SaveFeedback } from "@/app/components/SaveFeedback"

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
      <PageHeader
        title="Leagues"
        description="Global ranking and private groups — create a mini league, share an invite code, and compare points with friends."
        badge={
          !ranksLoading && globalRank ? (
            <span className="badge-pill tabular-nums">
              Global #{globalRank.rank} of {globalRank.total}
            </span>
          ) : undefined
        }
      />

      <Link
        href="/ranking"
        className="feature-card group glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border border-wc-gold/20 hover:border-wc-gold/35"
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
        <h2 className="section-kicker">Create league</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="League name"
          className="input-field"
        />
        <button type="submit" className="btn-primary w-full py-2.5 text-sm">
          Create
        </button>
      </form>

      <form onSubmit={joinLeague} className="glass rounded-2xl p-5 border border-cyan-400/15 space-y-3">
        <h2 className="section-kicker">Join with code</h2>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          placeholder="Invite code"
          className="input-field font-mono tracking-widest"
        />
        <button type="submit" className="btn-secondary w-full py-2.5 text-sm">
          Join league
        </button>
      </form>

      {msg && <SaveFeedback message={msg.text} variant={msg.type === "ok" ? "success" : "error"} className="mb-4" />}

      <section>
        <h2 className="section-kicker mb-3">Your leagues</h2>
        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : leagues.length === 0 ? (
          <EmptyState
            title="You're not in any league yet"
            description="Create a league for your friends or join with an invite code above."
          />
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
