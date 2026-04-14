import { createClient } from "@/lib/supabase/server"
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
    throw new Error("Invalid group.")
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
  const byUser = new Map<string, Omit<UserRow, "groupPoints" | "correct"> & { positions: Record<number, string> }>()
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

  const rows: UserRow[] = Array.from(byUser.values())
    .filter((r) => [1, 2, 3, 4].every((p) => r.positions[p]))
    .map((r) => {
      let groupPoints = 0
      const correct: Record<number, boolean> = {}
      for (let pos = 1; pos <= 4; pos++) {
        const ok = hasActual && r.positions[pos] === actualOrder[pos]
        correct[pos] = ok
        if (ok) groupPoints += 2
      }
      if (hasActual && groupPoints === 8) groupPoints += 2
      return { ...r, groupPoints, correct }
    })
  rows.sort((a, b) => b.groupPoints - a.groupPoints || a.name.localeCompare(b.name))

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          Group {code} – Predictions
        </h1>
        <Link
          href="/groups"
          className="rounded-xl px-3 py-2 text-white/90 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all page-intro-on-stadium"
        >
          ← Back to groups
        </Link>
      </div>

      {hasActual && (
        <div className="glass rounded-2xl border-2 border-wc-green/35 p-4 shadow-md">
          <p className="text-sm font-semibold text-wc-green-dark mb-3 uppercase tracking-wider">Actual order</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[1, 2, 3, 4].map((pos) => (
              <span key={pos} className="font-medium text-stone-800">
                {POSITION_LABELS[pos]}: <TeamWithFlag name={actualOrder[pos]} />
              </span>
            ))}
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-600">No predictions for this group yet.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-100/90 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">Player</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">1st</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">2nd</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">3rd</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">4th</th>
                <th className="px-4 py-3 text-right font-semibold text-stone-700">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.userId}
                  className="border-b border-stone-100 hover:bg-wc-gold-light/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  {[1, 2, 3, 4].map((pos) => (
                    <td
                      key={pos}
                      className={`px-4 py-3 ${r.correct[pos] ? "bg-wc-green-light/60 text-wc-green-dark" : "bg-red-50/80 text-red-800"}`}
                    >
                      <TeamWithFlag name={r.positions[pos]} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right font-semibold">{r.groupPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
