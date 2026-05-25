"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RankingBoard } from "@/app/components/RankingBoard"
import { computeMemberRanking, rankPosition, type RankedRow } from "@/lib/compute-member-ranking"

export default function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: leagueId } = use(params)
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [rows, setRows] = useState<RankedRow[]>([])
  const [myRank, setMyRank] = useState<{ rank: number; total: number } | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  function copyCode() {
    if (!code) return
    void navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login?next=" + encodeURIComponent(`/leagues/${leagueId}`))
        return
      }
      setCurrentUserId(user.id)

      const { data: league } = await supabase
        .from("private_leagues")
        .select("name, invite_code")
        .eq("id", leagueId)
        .maybeSingle()
      if (!league) {
        setLoading(false)
        return
      }
      setName(league.name)
      setCode(league.invite_code)

      const { data: mem } = await supabase
        .from("private_league_members")
        .select("user_id")
        .eq("league_id", leagueId)
      const userIds = [...new Set((mem ?? []).map((m: { user_id: string }) => m.user_id))]
      if (userIds.length === 0) {
        setLoading(false)
        return
      }

      const ranked = await computeMemberRanking(supabase, userIds)
      setRows(ranked)
      setMyRank(rankPosition(ranked, user.id))
      setLoading(false)
    }
    load()
  }, [leagueId, router])

  if (loading) {
    return (
      <main>
        <p className="text-white/50">Loading league…</p>
      </main>
    )
  }

  if (!name) {
    return (
      <main>
        <p className="text-red-300">League not found or you don&apos;t have access.</p>
        <Link href="/leagues" className="text-wc-gold underline mt-4 inline-block">
          Back to leagues
        </Link>
      </main>
    )
  }

  return (
    <main>
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <p className="text-white/40 text-sm">
              Private league · Code: <span className="text-wc-gold/80 font-mono font-semibold">{code}</span>
            </p>
            {myRank && (
              <span className="text-sm font-semibold text-wc-gold tabular-nums">
                Your position: #{myRank.rank} of {myRank.total}
              </span>
            )}
            <button
              type="button"
              onClick={copyCode}
              title="Copy invite code"
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-all duration-200 ${
                copied
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                  : "bg-white/6 border-white/15 text-white/50 hover:bg-white/12 hover:text-white hover:border-white/30"
              }`}
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>
        </div>
        <Link
          href="/leagues"
          className="rounded-xl px-4 py-2 text-white/50 hover:text-white/80 hover:bg-white/8 text-sm font-medium transition-all border border-transparent hover:border-white/10 shrink-0"
        >
          ← Leagues
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center border border-white/8">
          <p className="text-white/40">No members yet.</p>
        </div>
      ) : (
        <RankingBoard rows={rows} currentUserId={currentUserId} scrollToUser />
      )}

      <div className="mt-5 flex flex-wrap gap-4 px-1">
        {[
          { label: "Games", desc: "Match predictions" },
          { label: "Quest.", desc: "Special questions" },
          { label: "Groups", desc: "Group stage" },
          { label: "5-A-Side", desc: "Fantasy team" },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white/40">{label}</span>
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-white/25">{desc}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
