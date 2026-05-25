"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RankingBoard } from "@/app/components/RankingBoard"
import { PageHeader } from "@/app/components/PageHeader"
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
      <PageHeader
        title={name}
        description={
          code
            ? `Private league · Invite code ${code}`
            : "Private league standings"
        }
        backHref="/leagues"
        backLabel="Leagues"
        badge={
          myRank ? (
            <span className="badge-pill tabular-nums">
              #{myRank.rank} of {myRank.total}
            </span>
          ) : undefined
        }
      >
        {code && (
          <button
            type="button"
            onClick={copyCode}
            title="Copy invite code"
            className={`btn-ghost ${copied ? "text-emerald-300 border-emerald-400/30 bg-emerald-500/10" : ""}`}
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        )}
      </PageHeader>

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
