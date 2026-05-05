"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Member = { user_id: string; joined_at: string; display_name: string | null }

export default function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: leagueId } = use(params)
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [rows, setRows] = useState<{ user_id: string; display_name: string; points: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login?next=" + encodeURIComponent(`/leagues/${leagueId}`))
        return
      }

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

      const { data: mem } = await supabase.from("private_league_members").select("user_id, joined_at").eq("league_id", leagueId)
      const userIds = [...new Set((mem ?? []).map((m) => m.user_id))]
      const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds)
      const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name as string | null]))

      const memberList: Member[] = (mem ?? []).map((m) => ({
        user_id: m.user_id,
        joined_at: m.joined_at,
        display_name: nameById.get(m.user_id) ?? null,
      }))
      memberList.sort((a, b) => (a.display_name ?? a.user_id).localeCompare(b.display_name ?? b.user_id))
      setMembers(memberList)

      if (userIds.length) {
        const { data: preds } = await supabase.from("predictions").select("user_id, points").in("user_id", userIds)
        const sum = new Map<string, number>()
        for (const p of preds ?? []) {
          const pts = Number(p.points) || 0
          sum.set(p.user_id, (sum.get(p.user_id) ?? 0) + pts)
        }
        const ranked = userIds.map((uid) => ({
          user_id: uid,
          display_name: (nameById.get(uid) ?? "Player") as string,
          points: sum.get(uid) ?? 0,
        }))
        ranked.sort((a, b) => b.points - a.points || a.display_name.localeCompare(b.display_name))
        setRows(ranked)
      } else {
        setRows([])
      }

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
        <p className="text-red-300">League not found or you don’t have access.</p>
        <Link href="/leagues" className="text-wc-gold underline mt-4 inline-block">
          Back to leagues
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/leagues" className="text-xs text-white/40 hover:text-wc-gold mb-2 inline-block">
            ← All leagues
          </Link>
          <h1 className="text-3xl font-black text-gradient-hero [font-family:var(--font-outfit)]">{name}</h1>
          <p className="text-sm text-white/45 mt-1 font-mono tracking-wide">
            Invite code: <span className="text-wc-gold/90">{code}</span>
          </p>
        </div>
      </div>

      <section className="glass rounded-2xl overflow-hidden border border-white/10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-4 pt-4 pb-2">Standings (match points)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-slate-300 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, i) => (
              <tr key={r.user_id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-2 text-slate-500 tabular-nums">{i + 1}</td>
                <td className="px-4 py-2 font-medium text-slate-100">
                  <Link href={`/leagues/${leagueId}/member/${r.user_id}`} className="hover:text-wc-gold hover:underline">
                    {r.display_name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-right font-bold tabular-nums text-wc-gold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-4 py-6 text-slate-500 text-center text-sm">No points yet — predictions will appear after matches finish.</p>}
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Members</h2>
        <ul className="space-y-1">
          {members.map((m) => (
            <li key={m.user_id}>
              <Link href={`/leagues/${leagueId}/member/${m.user_id}`} className="text-sm text-white/70 hover:text-wc-gold transition-colors">
                {m.display_name ?? m.user_id.slice(0, 8) + "…"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
