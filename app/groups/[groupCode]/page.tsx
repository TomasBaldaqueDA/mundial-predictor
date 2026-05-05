import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"

const VALID_GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
const POSITION_LABELS: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
}

export default async function GroupViewPage({
  params,
}: {
  params: Promise<{ groupCode: string }>
}) {
  const { groupCode } = await params
  const code = groupCode?.toUpperCase()
  if (!code || !VALID_GROUPS.includes(code)) {
    notFound()
  }

  const supabase = await createClient()
  const [
    { data: preds, error: predError },
    { data: profiles },
    { data: actualRows },
  ] = await Promise.all([
    supabase
      .from("group_predictions")
      .select("user_id, team_name, position")
      .eq("group_code", code)
      .order("position", { ascending: true }),
    supabase.from("profiles").select("id, display_name"),
    supabase
      .from("group_actual_standings")
      .select("position, team_name")
      .eq("group_code", code)
      .order("position", { ascending: true }),
  ])

  if (predError) throw new Error(predError.message)

  const profileNameByUserId = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNameByUserId.set(p.id, name)
  }

  const actualOrder: Record<number, string> = {}
  for (const row of actualRows ?? []) {
    actualOrder[row.position] = row.team_name
  }
  const hasActual = [1, 2, 3, 4].every((p) => actualOrder[p])

  type UserRow = {
    userId: string
    name: string
    positions: Record<number, string>
    groupPoints: number
    correct: Record<number, boolean>
  }
  const byUser = new Map<string, Omit<UserRow, "groupPoints" | "correct">>()
  for (const row of preds ?? []) {
    const uid = row.user_id
    if (!uid) continue
    if (!byUser.has(uid)) {
      byUser.set(uid, {
        userId: uid,
        name: profileNameByUserId.get(uid) ?? "Anonymous",
        positions: {},
      })
    }
    byUser.get(uid)!.positions[row.position] = row.team_name
  }

  // Scoring per Rules: 1 pt per correct position; +1 perfect-group bonus.
  const rows: UserRow[] = Array.from(byUser.values())
    .filter((r) => [1, 2, 3, 4].every((p) => r.positions[p]))
    .map((r) => {
      let groupPoints = 0
      const correct: Record<number, boolean> = {}
      for (let pos = 1; pos <= 4; pos++) {
        const ok = hasActual && r.positions[pos] === actualOrder[pos]
        correct[pos] = ok
        if (ok) groupPoints += 1
      }
      if (hasActual && groupPoints === 4) groupPoints += 1
      return { ...r, groupPoints, correct }
    })
  rows.sort((a, b) => b.groupPoints - a.groupPoints || a.name.localeCompare(b.name))

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          Group {code} — predictions
        </h1>
        <Link
          href="/groups"
          className="rounded-xl px-3 py-2 text-white/70 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all"
        >
          ← Back to groups
        </Link>
      </div>

      {hasActual && (
        <div className="glass rounded-2xl border border-emerald-400/30 p-4 shadow-lg">
          <p className="text-xs font-semibold text-emerald-300 mb-3 uppercase tracking-wider">Actual order</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[1, 2, 3, 4].map((pos) => (
              <span key={pos} className="font-medium text-slate-100">
                <span className="text-slate-400">{POSITION_LABELS[pos]}: </span>
                <TeamWithFlag name={actualOrder[pos]} />
              </span>
            ))}
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-400">No predictions for this group yet.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-x-auto border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Player</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">1st</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">2nd</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">3rd</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">4th</th>
                <th className="px-4 py-3 text-right font-semibold text-wc-gold/85">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r.userId} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap">{r.name}</td>
                  {[1, 2, 3, 4].map((pos) => (
                    <td
                      key={pos}
                      className={`px-4 py-3 ${
                        hasActual
                          ? r.correct[pos]
                            ? "bg-emerald-500/12 text-emerald-100"
                            : "bg-red-500/10 text-red-100/90"
                          : "text-slate-200"
                      }`}
                    >
                      <TeamWithFlag name={r.positions[pos]} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right font-bold tabular-nums text-wc-gold">{r.groupPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
