import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"

const GROUPS_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export default async function ThirdPlacePredictionsPage() {
  const supabase = await createClient()
  const [
    { data: preds, error: predError },
    { data: profiles },
    { data: actualThirdPlaceGroups },
    { data: actualStandings },
  ] = await Promise.all([
    supabase
      .from("group_predictions")
      .select("user_id, group_code, team_name")
      .eq("position", 3)
      .eq("qualifies", true),
    supabase.from("profiles").select("id, display_name"),
    supabase.from("group_actual_third_place").select("group_code").order("group_code"),
    supabase.from("group_actual_standings").select("group_code, position, team_name"),
  ])

  if (predError) throw new Error(predError.message)

  const profileNameByUserId = new Map<string, string>()
  for (const p of profiles ?? []) {
    const name = (p.display_name ?? "").trim()
    if (name) profileNameByUserId.set(p.id, name)
  }

  const thirdPlaceGroupSet = new Set((actualThirdPlaceGroups ?? []).map((r: { group_code: string }) => r.group_code))
  const qualifiedTeamSet = new Set<string>()
  for (const row of actualStandings ?? []) {
    const r = row as { group_code: string; position: number; team_name: string }
    if (r.position <= 2) qualifiedTeamSet.add(`${r.group_code}|${r.team_name}`)
    if (r.position === 3 && thirdPlaceGroupSet.has(r.group_code)) qualifiedTeamSet.add(`${r.group_code}|${r.team_name}`)
  }
  const isQualified = (groupCode: string, teamName: string) => qualifiedTeamSet.has(`${groupCode}|${teamName}`)

  const actualThirdPlaceTeams: { groupCode: string; teamName: string }[] = []
  for (const row of actualStandings ?? []) {
    const r = row as { group_code: string; position: number; team_name: string }
    if (r.position === 3 && thirdPlaceGroupSet.has(r.group_code)) {
      actualThirdPlaceTeams.push({ groupCode: r.group_code, teamName: r.team_name })
    }
  }
  actualThirdPlaceTeams.sort((a, b) => GROUPS_ORDER.indexOf(a.groupCode) - GROUPS_ORDER.indexOf(b.groupCode))

  type UserRow = {
    userId: string
    name: string
    groups: { groupCode: string; teamName: string; correct: boolean }[]
    thirdPlaceBonus: number
  }
  const byUser = new Map<string, { userId: string; name: string; groups: { groupCode: string; teamName: string }[] }>()
  for (const row of preds ?? []) {
    const uid = row.user_id
    if (!uid) continue
    if (!byUser.has(uid)) {
      byUser.set(uid, {
        userId: uid,
        name: profileNameByUserId.get(uid) ?? "Anonymous",
        groups: [],
      })
    }
    byUser.get(uid)!.groups.push({ groupCode: row.group_code, teamName: row.team_name })
  }

  const rows: UserRow[] = Array.from(byUser.values())
    .filter((r) => r.groups.length === 8)
    .map((r) => {
      const sorted = [...r.groups].sort(
        (a, b) => GROUPS_ORDER.indexOf(a.groupCode) - GROUPS_ORDER.indexOf(b.groupCode)
      )
      const groupsWithCorrect = sorted.map(({ groupCode, teamName }) => ({
        groupCode,
        teamName,
        correct: isQualified(groupCode, teamName),
      }))
      const allCorrect = groupsWithCorrect.every((g) => g.correct)
      return {
        ...r,
        groups: groupsWithCorrect,
        thirdPlaceBonus: allCorrect ? 5 : 0,
      }
    })
  rows.sort((a, b) => b.thirdPlaceBonus - a.thirdPlaceBonus || a.name.localeCompare(b.name))

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          8 third-place teams – Predictions
        </h1>
        <Link
          href="/groups"
          className="rounded-xl px-3 py-2 text-white/90 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all page-intro-on-stadium"
        >
          ← Back to groups
        </Link>
      </div>

      <p className="page-intro-on-stadium text-sm leading-relaxed max-w-2xl">
        Which 8 groups have their 3rd place advancing. Only users who saved exactly 8 are shown.
      </p>

      {actualThirdPlaceTeams.length === 8 && (
        <div className="glass rounded-2xl border-2 border-wc-green/35 p-4 shadow-md">
          <p className="text-sm font-semibold text-wc-green-dark mb-3 uppercase tracking-wider">Actual 8 third-place (qualified)</p>
          <div className="flex flex-wrap gap-2">
            {actualThirdPlaceTeams.map(({ groupCode, teamName }) => (
              <span
                key={groupCode}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-wc-green-light border border-wc-green text-wc-green-dark"
              >
                {groupCode}: <TeamWithFlag name={teamName} />
              </span>
            ))}
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-600">No third-place predictions yet.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-100/90 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">Player</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-700">8 third-place teams</th>
                <th className="px-4 py-3 text-right font-semibold text-stone-700">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.userId}
                  className="border-b border-stone-100 hover:bg-wc-gold-light/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium align-top pt-4">{r.name}</td>
                  <td className="px-4 py-3 align-top pt-4">
                    <div className="flex flex-wrap gap-2">
                      {r.groups.map(({ groupCode, teamName, correct }) => (
                        <span
                          key={groupCode}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${correct ? "bg-wc-green-light/80 border border-wc-green text-wc-green-dark" : "bg-red-50 border border-red-200 text-red-800"}`}
                        >
                          {groupCode}: <TeamWithFlag name={teamName} />
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold align-top pt-4">{r.thirdPlaceBonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
