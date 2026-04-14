"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CustomSelect } from "@/app/components/CustomSelect"
import { ResultIcon } from "@/app/components/ResultIcon"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"

type GroupTeam = { group_code: string; team_name: string }
type GroupPredictionRow = { group_code: string; team_name: string; position: number; qualifies?: boolean }

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

const POSITION_LABELS: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
}

export default function GroupsPage() {
  const [teamsByGroup, setTeamsByGroup] = useState<Record<string, string[]>>({})
  const [predictions, setPredictions] = useState<Record<string, Record<number, string>>>({})
  const [thirdPlaceQualifiers, setThirdPlaceQualifiers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)
  const [savingThird, setSavingThird] = useState(false)
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [editingThirdPlace, setEditingThirdPlace] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [openSelectGroup, setOpenSelectGroup] = useState<string | null>(null)
  // Groups that have been saved to the server (show read-only until user clicks Edit)
  const [savedGroupCodes, setSavedGroupCodes] = useState<string[]>([])
  // 8 third-place qualifiers saved to the server (show read-only until user clicks Edit)
  const [savedThirdPlace, setSavedThirdPlace] = useState(false)
  // Actual standings (group_code -> position -> team_name) for points calculation
  const [actualStandings, setActualStandings] = useState<Record<string, Record<number, string>>>({})
  // Actual 8 groups whose 3rd place advances (for coloring and bonus)
  const [actualThirdPlaceGroups, setActualThirdPlaceGroups] = useState<string[]>([])
  const [firstMatchKickoff, setFirstMatchKickoff] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: teams } = await supabase.from("group_teams").select("group_code, team_name")
      const { data: { user } } = await supabase.auth.getUser()
      if (!teams) {
        setLoading(false)
        return
      }
      const byGroup: Record<string, string[]> = {}
      for (const row of teams as GroupTeam[]) {
        if (!byGroup[row.group_code]) byGroup[row.group_code] = []
        byGroup[row.group_code].push(row.team_name)
      }
      setTeamsByGroup(byGroup)

      if (user) {
        const { data: preds } = await supabase
          .from("group_predictions")
          .select("group_code, team_name, position, qualifies")
          .eq("user_id", user.id)
        if (preds) {
          const byGroupPos: Record<string, Record<number, string>> = {}
          const third: string[] = []
          const saved: string[] = []
          for (const p of preds as GroupPredictionRow[]) {
            if (!byGroupPos[p.group_code]) byGroupPos[p.group_code] = {}
            byGroupPos[p.group_code][p.position] = p.team_name
            if (p.position === 3 && p.qualifies) third.push(p.group_code)
          }
          for (const code of GROUPS) {
            const g = byGroupPos[code]
            if (g && g[1] && g[2] && g[3] && g[4]) saved.push(code)
          }
          setPredictions(byGroupPos)
          setThirdPlaceQualifiers(third)
          setSavedGroupCodes(saved)
          setSavedThirdPlace(third.length === 8)
        }
      }
      const { data: standings } = await supabase
        .from("group_actual_standings")
        .select("group_code, position, team_name")
      if (standings) {
        const byGroup: Record<string, Record<number, string>> = {}
        for (const row of standings as { group_code: string; position: number; team_name: string }[]) {
          if (!byGroup[row.group_code]) byGroup[row.group_code] = {}
          byGroup[row.group_code][row.position] = row.team_name
        }
        setActualStandings(byGroup)
      }
      const { data: thirdPlace } = await supabase
        .from("group_actual_third_place")
        .select("group_code")
      if (thirdPlace) {
        setActualThirdPlaceGroups((thirdPlace as { group_code: string }[]).map((r) => r.group_code).sort())
      }
      const { data: firstMatch } = await supabase
        .from("matches")
        .select("kickoff_time")
        .order("kickoff_time", { ascending: true })
        .limit(1)
        .single()
      if (firstMatch?.kickoff_time) {
        setFirstMatchKickoff(firstMatch.kickoff_time as string)
      }
      setLoading(false)
    }
    load()
  }, [])

  const { pointsPerGroup, totalFromGroups, all32Bonus, thirdPlaceBonus } = useMemo(() => {
    const perGroup: Record<string, number> = {}
    let total = 0
    const actualSet = new Set(actualThirdPlaceGroups)

    for (const code of GROUPS) {
      const pred = predictions[code] ?? {}
      const actual = actualStandings[code] ?? {}
      if (!actual[1] && !actual[2] && !actual[3] && !actual[4]) {
        perGroup[code] = 0
        continue
      }
      let correct = 0
      for (let pos = 1; pos <= 4; pos++) {
        if (pred[pos] && actual[pos] && pred[pos] === actual[pos]) correct++
      }
      const pts = correct + (correct === 4 ? 1 : 0)
      perGroup[code] = pts
      total += pts
    }

    // +10 all-32 bonus — mirrors public.calc_user_group_points (position-aware qualifier hits)
    let actualQualCount = 0
    for (const code of GROUPS) {
      const actual = actualStandings[code] ?? {}
      for (let pos = 1; pos <= 4; pos++) {
        const teamName = actual[pos]
        if (!teamName) continue
        const q = pos <= 2 || (pos === 3 && actualSet.has(code))
        if (q) actualQualCount++
      }
    }

    let predQualCnt = 0
    let predQualHits = 0
    for (const code of GROUPS) {
      const pred = predictions[code] ?? {}
      const actual = actualStandings[code] ?? {}
      for (let pos = 1; pos <= 4; pos++) {
        const teamName = pred[pos]
        if (!teamName) continue
        const userSlotQualifies = pos <= 2 || (pos === 3 && thirdPlaceQualifiers.includes(code))
        if (!userSlotQualifies) continue
        predQualCnt++
        const actualPos =
          actual[1] === teamName ? 1 : actual[2] === teamName ? 2 : actual[3] === teamName ? 3 : actual[4] === teamName ? 4 : 0
        if (!actualPos) continue
        const teamActuallyQualifies = actualPos <= 2 || (actualPos === 3 && actualSet.has(code))
        if (teamActuallyQualifies) predQualHits++
      }
    }

    const all32 =
      actualQualCount === 32 && predQualCnt === 32 && predQualHits === 32 ? 10 : 0

    const predThirdSet = new Set(thirdPlaceQualifiers)
    const actualThirdSet = new Set(actualThirdPlaceGroups)
    const third8 =
      actualThirdPlaceGroups.length === 8 &&
      thirdPlaceQualifiers.length === 8 &&
      predThirdSet.size === 8 &&
      [...predThirdSet].every((g) => actualThirdSet.has(g))
        ? 5
        : 0

    return {
      pointsPerGroup: perGroup,
      totalFromGroups: total,
      all32Bonus: all32,
      thirdPlaceBonus: third8,
    }
  }, [predictions, actualStandings, actualThirdPlaceGroups, thirdPlaceQualifiers])

  const competitionStarted = firstMatchKickoff ? new Date() >= new Date(firstMatchKickoff) : false

  function setPosition(groupCode: string, position: number, teamName: string) {
    setPredictions((prev) => {
      const group = { ...(prev[groupCode] ?? {}) }
      const oldTeam = group[position]
      if (oldTeam === teamName) return prev
      const byPos: Record<number, string> = {}
      for (let p = 1; p <= 4; p++) {
        const v = p === position ? teamName : group[p]
        if (v) byPos[p] = v
      }
      if (teamName) byPos[position] = teamName
      else delete byPos[position]
      const swapPos = Object.entries(group).find(([, t]) => t === teamName)?.[0]
      if (swapPos) {
        const other = parseInt(swapPos, 10)
        if (oldTeam) byPos[other] = oldTeam
        else delete byPos[other]
      }
      return { ...prev, [groupCode]: byPos }
    })
  }

  async function saveGroup(groupCode: string) {
    setMessage(null)
    setSavingGroup(groupCode)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSavingGroup(null)
      return
    }
    const pred = predictions[groupCode] ?? {}
    const positions = [1, 2, 3, 4].filter((p) => pred[p])
    if (positions.length !== 4) {
      setMessage({ type: "error", text: `Group ${groupCode}: select all 4 teams (1st to 4th).` })
      setSavingGroup(null)
      return
    }
    const teams = teamsByGroup[groupCode] ?? []
    const chosen = new Set(positions.map((p) => pred[p]))
    if (chosen.size !== 4 || [...chosen].some((t) => !teams.includes(t))) {
      setMessage({ type: "error", text: `Group ${groupCode}: all 4 teams must be from this group.` })
      setSavingGroup(null)
      return
    }

    await supabase
      .from("group_predictions")
      .delete()
      .eq("user_id", user.id)
      .eq("group_code", groupCode)
    const rows = positions.map((position) => ({
      user_id: user.id,
      group_code: groupCode,
      team_name: pred[position]!,
      position,
      qualifies: position <= 2 ? true : position === 4 ? false : thirdPlaceQualifiers.includes(groupCode),
    }))
    const { error } = await supabase.from("group_predictions").insert(rows)
    setSavingGroup(null)
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setSavedGroupCodes((prev) => (prev.includes(groupCode) ? prev : [...prev, groupCode]))
      setEditingGroup((current) => (current === groupCode ? null : current))
      setMessage({ type: "ok", text: `Group ${groupCode} saved.` })
      setEditingGroup(null)
    }
  }

  function toggleThirdPlace(groupCode: string) {
    setThirdPlaceQualifiers((prev) => {
      if (prev.includes(groupCode)) return prev.filter((c) => c !== groupCode)
      if (prev.length >= 8) return prev
      return [...prev, groupCode]
    })
  }

  async function saveThirdPlaceQualifiers() {
    setMessage(null)
    setSavingThird(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSavingThird(false)
      return
    }
    if (thirdPlaceQualifiers.length !== 8) {
      setMessage({ type: "error", text: "You must select exactly 8 third-place teams." })
      setSavingThird(false)
      return
    }
    const { data: rows } = await supabase
      .from("group_predictions")
      .select("group_code")
      .eq("user_id", user.id)
      .eq("position", 3)
    if (!rows || rows.length !== 12) {
      setMessage({ type: "error", text: "Save the order of all 12 groups first." })
      setSavingThird(false)
      return
    }
    const qualSet = new Set(thirdPlaceQualifiers)
    for (const { group_code } of rows) {
      await supabase
        .from("group_predictions")
        .update({ qualifies: qualSet.has(group_code) })
        .eq("user_id", user.id)
        .eq("group_code", group_code)
        .eq("position", 3)
    }
    setSavingThird(false)
    setMessage({ type: "ok", text: "8 third-place teams saved." })
    setSavedThirdPlace(true)
    setEditingThirdPlace(false)
  }

  const hasAllGroupsFilled = GROUPS.every((c) => {
    const p = predictions[c] ?? {}
    return [1, 2, 3, 4].every((pos) => p[pos])
  })
  const thirdPlaceOptions = GROUPS.map((groupCode) => ({
    groupCode,
    teamName: (predictions[groupCode] ?? {})[3] ?? "",
  })).filter((o) => o.teamName)

  if (loading) {
    return (
      <div className="text-slate-400 text-center py-12 text-lg">
        Loading groups…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">Group predictions</h1>

      <p className="page-intro-on-stadium text-sm leading-relaxed max-w-2xl -mt-2">
        Pick 1st–4th in every group and which third-place sides advance. Points update as results come in.
      </p>

      {message && (
        <p className={message.type === "ok" ? "text-wc-green text-sm" : "text-red-600 text-sm"}>
          {message.text}
        </p>
      )}

      <div className="glass rounded-2xl p-5 border-wc-gold/20">
        <h2 className="text-lg font-semibold text-emerald-300 mb-3">Your points per group</h2>
        <p className="text-sm text-slate-400 mb-3 leading-relaxed">
          <span className="text-slate-200 font-medium">Scoring:</span> 1 pt per correct position (max 4/group); +1 if all
          four are right; +10 if your 32 qualifiers match reality; +5 if you nail the 8 advancing third-place groups.
          Totals also appear in the ranking <span className="text-slate-200 font-medium">Groups</span> column.{" "}
          <Link href="/rules" className="text-wc-gold font-medium hover:underline">
            Full rules
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {GROUPS.map((code) => (
            <span key={code} className="font-medium text-slate-200">
              Group {code}: <span className="text-emerald-300">{pointsPerGroup[code] ?? 0} pts</span>
            </span>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-sm">
          <p className="font-semibold text-slate-100">Subtotal (positions & perfect): {totalFromGroups} pts</p>
          <p className="text-slate-400">All 32 qualified bonus: {all32Bonus} pts</p>
          <p className="text-slate-400">Third-place groups bonus: {thirdPlaceBonus} pts</p>
          <p className="font-semibold text-slate-100 pt-1">
            Total groups: {totalFromGroups + all32Bonus + thirdPlaceBonus} pts
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((groupCode) => {
          const teams = teamsByGroup[groupCode] ?? []
          const pred = predictions[groupCode] ?? {}
          const isSavedToServer = savedGroupCodes.includes(groupCode)
          const isEditing = editingGroup === groupCode
          const showForm = !competitionStarted && (!isSavedToServer || isEditing)

          return (
            <div
              key={groupCode}
              className={`relative glass rounded-2xl p-5 hover:-translate-y-0.5 ${openSelectGroup === groupCode ? "z-20" : ""}`}
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg font-semibold text-wc-green-dark">Group {groupCode}</h2>
                <Link
                  href={`/groups/${groupCode}`}
                  className="rounded-xl border-2 border-wc-gold text-wc-gold px-3 py-1.5 text-sm font-semibold hover:bg-wc-gold-light/30 transition-all shrink-0"
                >
                  View predictions
                </Link>
              </div>
              {showForm ? (
                <>
                  <div className="space-y-2">
                    {([1, 2, 3, 4] as const).map((pos) => {
                      const passes =
                        pos <= 2 ? true : pos === 3 ? thirdPlaceQualifiers.includes(groupCode) : false
                      const actualTeam = actualStandings[groupCode]?.[pos]
                      const predictedTeam = pred[pos]
                      const hasResult = !!actualTeam
                      const isCorrect = hasResult && predictedTeam === actualTeam
                      const rowBg = passes
                        ? "bg-emerald-500/18 border border-emerald-400/30"
                        : "bg-slate-800/55 border border-white/10"
                      return (
                        <div
                          key={pos}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 ${rowBg}`}
                        >
                          <span className="text-slate-400 w-9 text-sm font-medium shrink-0">{POSITION_LABELS[pos]}</span>
                          <CustomSelect
                            value={pred[pos] ?? ""}
                            options={teams}
                            placeholder="— Select team —"
                            onChange={(v) => setPosition(groupCode, pos, v)}
                            onOpenChange={(open) => setOpenSelectGroup(open ? groupCode : null)}
                            renderOption={(teamName) => <TeamWithFlag name={teamName} />}
                          />
                          {hasResult && (
                            <span className="ml-auto shrink-0 flex items-center justify-center">
                              <ResultIcon correct={isCorrect} />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => saveGroup(groupCode)}
                    disabled={savingGroup === groupCode}
                    className="mt-4 w-full rounded-xl bg-wc-gold text-white py-2.5 text-sm font-semibold hover:bg-wc-gold-dark disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {savingGroup === groupCode ? "Saving…" : isSavedToServer && isEditing ? "Save changes" : "Save group " + groupCode}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    {([1, 2, 3, 4] as const).map((pos) => {
                      const passes =
                        pos <= 2 ? true : pos === 3 ? thirdPlaceQualifiers.includes(groupCode) : false
                      const actualTeam = actualStandings[groupCode]?.[pos]
                      const predictedTeam = pred[pos]
                      const hasResult = !!actualTeam
                      const isCorrect = hasResult && predictedTeam === actualTeam
                      const rowBg = passes
                        ? "bg-emerald-500/18 border border-emerald-400/30"
                        : "bg-slate-800/55 border border-white/10"
                      return (
                        <div
                          key={pos}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${rowBg}`}
                        >
                          <span className="text-slate-400 w-9 text-sm font-medium shrink-0">{POSITION_LABELS[pos]}</span>
                          <TeamWithFlag name={pred[pos]} className="text-sm font-medium text-slate-100" />
                          {hasResult && (
                            <span className="ml-auto shrink-0 flex items-center justify-center">
                              <ResultIcon correct={isCorrect} />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200">
                      Points: <span className="text-emerald-300">{pointsPerGroup[groupCode] ?? 0} pts</span>
                    </p>
                    {!competitionStarted && (
                      <button
                        type="button"
                        onClick={() => setEditingGroup(groupCode)}
                        className="rounded-xl border-2 border-wc-gold/45 bg-slate-800/70 py-2.5 px-4 text-sm font-semibold text-slate-100 hover:bg-slate-700/80 transition-all duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {hasAllGroupsFilled && (
        <div className="glass rounded-2xl p-6 border-wc-gold/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-semibold text-wc-green-dark">
              Select the 8 third-place teams that advance
            </h2>
            <Link
              href="/groups/third-place"
              className="rounded-xl border-2 border-wc-gold text-wc-gold px-3 py-1.5 text-sm font-semibold hover:bg-wc-gold-light/30 transition-all shrink-0"
            >
              View predictions
            </Link>
          </div>
          {(savedThirdPlace && !editingThirdPlace) || (competitionStarted && thirdPlaceQualifiers.length === 8) ? (
            <>
              <p className="text-sm text-slate-400 mb-3">
                The 8 third-place teams that advance:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...thirdPlaceQualifiers]
                  .sort((a, b) => GROUPS.indexOf(a) - GROUPS.indexOf(b))
                  .map((groupCode) => {
                    const teamName = (predictions[groupCode] ?? {})[3] ?? ""
                    return (
                      <span
                        key={groupCode}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border border-emerald-400/35 bg-emerald-500/20 text-emerald-100"
                      >
                        {groupCode}: <TeamWithFlag name={teamName} />
                      </span>
                    )
                  })}
              </div>
              {!competitionStarted && (
                <button
                  type="button"
                  onClick={() => setEditingThirdPlace(true)}
                  className="rounded-xl border-2 border-wc-gold/45 bg-slate-800/70 py-2 px-4 text-sm font-semibold text-slate-100 hover:bg-slate-700/80 transition-all duration-200"
                >
                  Edit
                </button>
              )}
            </>
          ) : (
            <>
              {competitionStarted && (
                <p className="text-sm text-amber-700 mb-2 font-medium">Predictions are closed (competition has started).</p>
              )}
              <p className="text-sm text-slate-400 mb-3">
                Choose exactly 8 groups whose 3rd place advances ({thirdPlaceQualifiers.length}/8).
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {thirdPlaceOptions.map(({ groupCode, teamName }) => {
                  const selected = thirdPlaceQualifiers.includes(groupCode)
                  const chipBg = selected
                    ? "bg-emerald-500/25 border-emerald-400/40 text-emerald-100"
                    : "bg-slate-800/70 border-white/15 text-slate-200 hover:bg-slate-700/80"
                  return (
                  <label
                    key={groupCode}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm cursor-pointer border transition-colors ${chipBg}`}
                  >
                    <input
                      type="checkbox"
                      checked={thirdPlaceQualifiers.includes(groupCode)}
                      onChange={() => !competitionStarted && toggleThirdPlace(groupCode)}
                      disabled={competitionStarted}
                      className="rounded border-slate-500 text-emerald-600 accent-emerald-500"
                    />
                    <span className="inline-flex items-center gap-1.5">
                      {groupCode}: <TeamWithFlag name={teamName} />
                    </span>
                  </label>
                )})}
              </div>
              <button
                type="button"
                onClick={saveThirdPlaceQualifiers}
                disabled={competitionStarted || savingThird || thirdPlaceQualifiers.length !== 8}
                className="rounded-xl bg-wc-gold text-white py-2.5 px-5 text-sm font-semibold hover:bg-wc-gold-dark disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {savingThird ? "Saving…" : "Save 8 third-place teams"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
