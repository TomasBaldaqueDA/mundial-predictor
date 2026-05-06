"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { KickoffCountdown } from "@/app/components/KickoffCountdown"
import { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatKickoffDisplay } from "@/lib/format-kickoff"
import { buildPowerUpBucketMap, type PowerUpBucket } from "@/lib/powerup-bucket"
import { validatePowerUpPhase } from "@/lib/powerup-week-client"

const MVP_POS_ORDER: Record<string, number> = { gk: 1, df: 2, md: 3, st: 4 }

const STAGE_ORDER = [
  "First Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Play-off for third place",
  "Final",
] as const

const GROUP_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

/** Group stage “matchdays”: 1st / 2nd / 3rd game per group by kickoff order */
const GROUP_STAGE_ROUNDS = ["1st Round", "2nd Round", "3rd Round"] as const

type Match = {
  id: number
  team1: string
  team2: string
  kickoff_time: string
  status?: string | null
  score1?: number | null
  score2?: number | null
  mvp?: string | null
  qualifier?: string | null
  group?: string | null
  stage?: string | null
}

type UserPrediction = {
  pred_score1: number
  pred_score2: number
  pred_mvp: string | null
  pred_qualifier: string | null
  points: number | null
  points_multiplier?: number | null
}

type Section = { title: string; stage: string; isKnockout: boolean; matches: Match[] }

/** Single block, all matches sorted by kickoff (no Group A / Group B headings). */
function matchesIntoKickoffOrderSections(matches: Match[]): Section[] {
  const sorted = [...matches].sort(
    (a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
  )
  if (!sorted.length) return []
  return [{ title: "", stage: "chronological", isKnockout: false, matches: sorted }]
}

function pickGroupStageRoundRange(matches: Match[], startIndex: number, endIndex: number): Match[] {
  const firstStage = matches.filter((m) => m.stage === "First Stage" && m.group)
  const byGroup = new Map<string, Match[]>()
  for (const m of firstStage) {
    const g = m.group ?? ""
    if (!byGroup.has(g)) byGroup.set(g, [])
    byGroup.get(g)!.push(m)
  }
  const out: Match[] = []
  for (const g of GROUP_ORDER) {
    const list =
      byGroup
        .get(g)
        ?.sort(
          (a, b) =>
            new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
        ) ?? []
    for (let idx = startIndex; idx <= endIndex; idx++) {
      const pick = list[idx]
      if (pick) out.push(pick)
    }
  }
  return out.sort(
    (a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
  )
}

// ─── Inline prediction form ───────────────────────────────────────────────────

function InlinePredictForm({
  match,
  existing,
  predictionRowId,
  powerUpActive,
  onSave,
  onCancel,
}: {
  match: Match
  existing: UserPrediction | undefined
  predictionRowId: number | undefined
  powerUpActive: boolean
  onSave: (pred: UserPrediction, rowId: number) => void
  /** When set (e.g. editing a saved pick), shown next to save — discards unsaved edits and closes editor */
  onCancel?: () => void
}) {
  const [score1, setScore1] = useState(existing ? String(existing.pred_score1) : "")
  const [score2, setScore2] = useState(existing ? String(existing.pred_score2) : "")
  const [mvp, setMvp] = useState(existing?.pred_mvp ?? "")
  const [mvpPlayers, setMvpPlayers] = useState<string[]>([])
  const [qualifier, setQualifier] = useState(existing?.pred_qualifier ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isKnockout = (match.stage ?? "") !== "First Stage"
  const s1 = Number(score1)
  const s2 = Number(score2)
  const validScores = score1 !== "" && score2 !== "" && Number.isInteger(s1) && Number.isInteger(s2) && s1 >= 0 && s2 >= 0
  const knockoutDraw = isKnockout && validScores && s1 === s2
  const knockoutWinner = isKnockout && validScores && s1 !== s2 ? (s1 > s2 ? match.team1 : match.team2) : null
  const closed = new Date(match.kickoff_time) <= new Date()

  useEffect(() => {
    async function loadRoster() {
      const supabase = createClient()
      const { data: roster } = await supabase
        .from("five_a_side_players")
        .select("name, team, position")
        .in("team", [match.team1, match.team2])
      const rows = roster ?? []
      rows.sort((a, b) => {
        const t1 = a.team === match.team1 ? 0 : 1
        const t2 = b.team === match.team1 ? 0 : 1
        if (t1 !== t2) return t1 - t2
        const pa = MVP_POS_ORDER[a.position] ?? 9
        const pb = MVP_POS_ORDER[b.position] ?? 9
        if (pa !== pb) return pa - pb
        return a.name.localeCompare(b.name)
      })
      const names = rows.map((r) => r.name)
      setMvpPlayers(names)
      setMvp((prev) => (prev && names.includes(prev) ? prev : ""))
    }
    loadRoster()
  }, [match.team1, match.team2])

  useEffect(() => {
    if (!knockoutWinner || qualifier === knockoutWinner) return
    const t = window.setTimeout(() => setQualifier(knockoutWinner), 0)
    return () => window.clearTimeout(t)
  }, [knockoutWinner, qualifier, match.team1, match.team2])

  async function handleSave() {
    if (closed) { setError("Predictions are closed for this match."); return }
    if (!mvp.trim()) { setError("Please fill in the MVP."); return }
    if (!validScores) { setError("Scores must be valid numbers (≥ 0)."); return }
    if (knockoutDraw && !qualifier) { setError("For a knockout draw, please select who qualifies."); return }

    const effectiveQualifier = isKnockout
      ? (s1 === s2 ? qualifier || null : knockoutWinner)
      : null

    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to save a prediction.")
      setSaving(false)
      return
    }

    const mult = powerUpActive ? 2 : 1
    const phaseCheck = await validatePowerUpPhase(supabase, {
      userId: user.id,
      targetMatch: {
        id: match.id,
        stage: match.stage ?? null,
        group: match.group ?? null,
        kickoff_time: match.kickoff_time,
      },
      enable: mult === 2,
      excludePredictionId: predictionRowId ?? null,
    })
    if (!phaseCheck.ok) {
      setError(phaseCheck.message)
      setSaving(false)
      return
    }

    let savedRowId: number | undefined

    if (predictionRowId != null) {
      const { data, error: err } = await supabase
        .from("predictions")
        .update({
          pred_score1: s1,
          pred_score2: s2,
          pred_mvp: mvp,
          pred_qualifier: effectiveQualifier,
          points_multiplier: mult,
        })
        .eq("id", predictionRowId)
        .eq("user_id", user.id)
        .select("id")
        .single()
      if (err || !data) { setError("Error updating prediction."); setSaving(false); return }
      savedRowId = data.id
    } else {
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()
      const displayName = (profile?.display_name ?? "").trim() || "Anonymous"
      const { data, error: err } = await supabase
        .from("predictions")
        .insert({
          user_name: displayName,
          user_id: user.id,
          match_id: match.id,
          pred_score1: s1,
          pred_score2: s2,
          pred_mvp: mvp,
          pred_qualifier: effectiveQualifier,
          points_multiplier: mult,
        })
        .select("id")
        .single()
      if (err || !data) { setError("Error saving prediction."); setSaving(false); return }
      savedRowId = data.id
    }

    setSaving(false)
    onSave(
      {
        pred_score1: s1,
        pred_score2: s2,
        pred_mvp: mvp,
        pred_qualifier: effectiveQualifier,
        points: null,
        points_multiplier: mult,
      },
      savedRowId!
    )
  }

  const scoreInputClass =
    "shrink-0 w-[4.5rem] sm:w-[5.25rem] px-2 sm:px-3 py-2 sm:py-2.5 border border-cyan-500/25 rounded-xl bg-slate-900/80 text-slate-50 font-black text-lg sm:text-xl tabular-nums text-center focus:border-wc-gold focus:ring-2 focus:ring-wc-gold/25 disabled:opacity-50 transition-colors"

  return (
    <div className="space-y-4">
      {/* Full-width rows: flag + name + score; VS; away same — names can wrap */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <TeamWithFlag name={match.team1} size="lg" truncate={false} className="max-w-full" />
          </div>
          <input
            type="number"
            min={0}
            max={30}
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            disabled={closed || saving}
            placeholder="0"
            aria-label={`Goals ${match.team1}`}
            className={scoreInputClass}
          />
        </div>
        <div className="flex justify-center py-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
            VS
          </span>
        </div>
        <div className="flex items-start gap-2 sm:gap-3 min-w-0 w-full">
          <div className="min-w-0 flex-1">
            <TeamWithFlag name={match.team2} size="lg" truncate={false} className="max-w-full" />
          </div>
          <input
            type="number"
            min={0}
            max={30}
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            disabled={closed || saving}
            placeholder="0"
            aria-label={`Goals ${match.team2}`}
            className={scoreInputClass}
          />
        </div>
      </div>

      {/* Knockout: auto-winner or draw qualifier */}
      {isKnockout && knockoutWinner && (
        <p className="text-xs text-emerald-200 bg-emerald-500/12 border border-emerald-400/35 rounded-xl px-3 py-1.5">
          ✓ {knockoutWinner} qualifies
        </p>
      )}
      {knockoutDraw && (
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Who qualifies?</label>
          <select
            value={qualifier}
            onChange={(e) => setQualifier(e.target.value)}
            disabled={saving}
            className="w-full px-3 py-2 border border-cyan-500/25 rounded-xl bg-slate-900/80 text-slate-200 text-sm focus:border-wc-gold focus:ring-2 focus:ring-wc-gold/20"
          >
            <option value="">— Select team —</option>
            <option value={match.team1 ?? ""}>{match.team1}</option>
            <option value={match.team2 ?? ""}>{match.team2}</option>
          </select>
        </div>
      )}

      {/* MVP */}
      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">MVP</label>
        {mvpPlayers.length > 0 ? (
          <select
            value={mvpPlayers.includes(mvp) ? mvp : ""}
            disabled={closed || saving}
            onChange={(e) => setMvp(e.target.value)}
            className="select-modern w-full px-3 py-2 border border-cyan-500/25 rounded-xl bg-slate-900/80 text-slate-200 text-sm focus:border-wc-gold focus:ring-2 focus:ring-wc-gold/20 disabled:opacity-50"
          >
            <option value="">— Squad player —</option>
            {mvpPlayers.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            disabled={closed || saving}
            placeholder="Loading squad… or type MVP"
            className="w-full px-3 py-2 border border-cyan-500/25 rounded-xl bg-slate-900/80 text-slate-200 text-sm focus:border-wc-gold focus:ring-2 focus:ring-wc-gold/20 disabled:opacity-50 transition-colors"
          />
        )}
      </div>

      {/* Error / closed */}
      {error && (
        <p className="text-xs text-red-200 bg-red-500/15 border border-red-400/35 rounded-xl px-3 py-2">{error}</p>
      )}
      {closed && !error && (
        <p className="text-xs text-slate-400 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2">Predictions are closed for this match.</p>
      )}

      {/* Save */}
      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || closed}
          className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {saving ? "Saving…" : predictionRowId != null ? "Save changes" : "Save prediction"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 text-sm font-medium hover:bg-white/8 transition-colors disabled:opacity-50 shrink-0"
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Saved prediction (read-only summary until user taps “Edit”) ────────────

function SavedPredictionPanel({
  match,
  pred,
  kickoffTime,
  onEdit,
}: {
  match: Match
  pred: UserPrediction
  kickoffTime: string
  onEdit?: () => void
}) {
  const isKnockout = (match.stage ?? "") !== "First Stage"
  const x2 = Number(pred.points_multiplier) === 2
  const editable = typeof onEdit === "function"

  return (
    <div className="relative rounded-2xl overflow-hidden border border-wc-gold/35 bg-gradient-to-br from-[#0c1220] via-slate-900/90 to-[#070d18] shadow-[0_0_36px_rgba(240,180,41,0.14),inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% -10%, rgba(240, 180, 41, 0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(34, 211, 238, 0.06) 0%, transparent 45%)",
        }}
      />
      <div className="relative px-3 sm:px-4 py-3 sm:py-4 space-y-3">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/25 pl-2 pr-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/95 w-fit">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/25 border border-emerald-400/35 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-emerald-200" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 0 0-4.5 4.5V8H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Prediction saved
          </span>
          {editable ? (
            <span className="text-[10px] text-slate-500 font-medium tabular-nums leading-snug">
              Editable until {formatKickoffDisplay(kickoffTime)}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium tabular-nums leading-snug">
              Locked at kickoff ({formatKickoffDisplay(kickoffTime)})
            </span>
          )}
        </div>

        {/* Single row: fits narrow grid columns; team names truncate */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-1.5 gap-y-1 items-center pt-0.5">
          <div className="min-w-0 flex justify-end">
            <TeamWithFlag
              name={match.team1}
              size="md"
              className="flex-row-reverse text-right max-w-full"
              flagSize="w40"
            />
          </div>
          <div className="flex items-baseline justify-center gap-0.5 shrink-0 px-0.5">
            <span className="text-2xl font-black tabular-nums text-white tracking-tight leading-none">
              {pred.pred_score1}
            </span>
            <span className="text-wc-gold/80 text-lg font-extralight select-none translate-y-[-0.05em]" aria-hidden>
              –
            </span>
            <span className="text-2xl font-black tabular-nums text-white tracking-tight leading-none">
              {pred.pred_score2}
            </span>
          </div>
          <div className="min-w-0 flex justify-start">
            <TeamWithFlag name={match.team2} size="md" className="text-left max-w-full" flagSize="w40" />
          </div>
        </div>

        {x2 && (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-200 tracking-wide">
              Power-up ×2 active
            </span>
          </div>
        )}

        <div className="rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-500/[0.09] to-transparent px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200/75 mb-1">Predicted MVP</p>
          <p className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug break-words">
            {pred.pred_mvp?.trim() || "—"}
          </p>
        </div>

        {isKnockout && pred.pred_qualifier && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 min-w-0">
            <span className="shrink-0">Predicted qualifier:</span>
            <TeamWithFlag name={pred.pred_qualifier} size="md" className="text-slate-200 font-medium min-w-0" />
          </div>
        )}

        {editable && (
          <div className="pt-1 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-wc-gold/55 bg-wc-gold/10 px-3 py-2 text-xs sm:text-sm font-semibold text-wc-gold hover:bg-wc-gold/20 hover:border-wc-gold/80 transition-all duration-200 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7A.75.75 0 0 1 7 3.5H4.75Z" />
              </svg>
              Edit prediction
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Match card ───────────────────────────────────────────────────────────────

function MatchCard({
  match,
  showPredict,
  hasUserPrediction,
  filterParam,
  subFilterParam,
  userPrediction,
  predictionRowId,
  onPredictionSaved,
  signedIn,
  powerUpActive,
  onPowerUpToggle,
  powerUpBusy,
  powerUpError,
  powerUpPhaseLocked,
}: {
  match: Match
  showPredict: boolean
  hasUserPrediction: boolean
  filterParam: string
  subFilterParam: string
  userPrediction: UserPrediction | undefined
  predictionRowId: number | undefined
  onPredictionSaved: (pred: UserPrediction, rowId: number) => void
  signedIn: boolean
  powerUpActive: boolean
  onPowerUpToggle: (enabled: boolean) => void
  powerUpBusy: boolean
  powerUpError: string | null
  /** True when another match in this phase already has ×2 — cannot enable here until that one is cleared */
  powerUpPhaseLocked: boolean
}) {
  const [showPredictionEditor, setShowPredictionEditor] = useState(!hasUserPrediction)

  useEffect(() => {
    // Keep saved predictions collapsed by default; open editor only when user taps Edit.
    const t = window.setTimeout(() => setShowPredictionEditor(!hasUserPrediction), 0)
    return () => window.clearTimeout(t)
  }, [hasUserPrediction, predictionRowId])

  const hasResult = match.score1 != null && match.score2 != null
  const isLive = match.status === "started"
  const showLiveOrResultBoard = isLive || hasResult
  const score1Display = match.score1 ?? 0
  const score2Display = match.score2 ?? 0
  const predictClosed = new Date(match.kickoff_time) <= new Date()
  const canEditPrediction = showPredict && signedIn && !predictClosed && !hasResult
  const showPowerStrip = canEditPrediction
  const showPastResult = hasResult && filterParam === "past"
  const matchViewParams = new URLSearchParams()
  if (filterParam) matchViewParams.set("filter", filterParam)
  if (subFilterParam) matchViewParams.set("subFilter", subFilterParam)
  const matchViewHref = `/match/${match.id}${matchViewParams.toString() ? `?${matchViewParams.toString()}` : ""}`
  const finishedWithPoints = hasResult && userPrediction && userPrediction.points != null
  const isKnockout = (match.stage ?? "") !== "First Stage"
  const isSavedSummaryView =
    canEditPrediction && hasUserPrediction && !showPredictionEditor && !hasResult

  const cardBorder = finishedWithPoints
    ? userPrediction!.points! > 0
      ? "border-emerald-300/50"
      : "border-red-300/40"
    : isSavedSummaryView
      ? "border-wc-gold/40 shadow-[0_0_32px_rgba(240,180,41,0.16)]"
      : "border-white/35 hover:border-cyan-400/35"

  const ptsBadge = finishedWithPoints
    ? userPrediction.points! > 0
      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/35"
      : "bg-red-500/15 text-red-200 border border-red-400/35"
    : null

  return (
    <div
      className={`glass rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 min-w-0 ${cardBorder}`}
    >

      {/* ── Top bar ── */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-white/10 gap-2">
        <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-2 flex-wrap">
          {formatKickoffDisplay(match.kickoff_time)}
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-100 bg-red-500/20 border border-red-400/40 px-2 py-0.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" aria-hidden />
              Live
            </span>
          )}
          {!isLive && !hasResult && <KickoffCountdown kickoff={match.kickoff_time} />}
        </span>
        {finishedWithPoints && ptsBadge && (
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ptsBadge}`}>
            {userPrediction.points! > 0 ? "+" : ""}{userPrediction.points} pts
          </span>
        )}
      </div>

      <div className="px-4 sm:px-5 py-4">
        {showLiveOrResultBoard ? (
          <>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1 flex justify-end min-w-0">
                <TeamWithFlag
                  name={match.team1}
                  size="lg"
                  className="flex-row-reverse text-right max-w-full"
                />
              </div>
              <div className="flex flex-col items-center justify-center shrink-0 px-1">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
                  {score1Display}–{score2Display}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <TeamWithFlag name={match.team2} size="lg" className="max-w-full" />
              </div>
            </div>

            {showPastResult && (match.mvp || (isKnockout && match.qualifier)) && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {match.mvp && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden>
                      <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd"/>
                    </svg>
                    MVP: {match.mvp}
                  </span>
                )}
                {isKnockout && match.qualifier && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                    ✓ <TeamWithFlag name={match.qualifier} className="text-xs" />
                  </span>
                )}
              </div>
            )}

            {userPrediction && (
              <div
                className={`mt-3 text-xs rounded-xl px-3 py-2 ring-1 ring-white/8 ${
                  finishedWithPoints && userPrediction.points! > 0
                    ? "bg-emerald-500/12 text-emerald-200"
                    : finishedWithPoints
                      ? "bg-red-500/12 text-red-200"
                      : "bg-slate-900/45 text-slate-400"
                }`}
              >
                Your prediction:{" "}
                <span className="font-semibold tabular-nums">
                  {userPrediction.pred_score1}–{userPrediction.pred_score2}
                </span>
                {userPrediction.pred_mvp && (
                  <>
                    {" "}
                    · MVP: <span className="font-semibold">{userPrediction.pred_mvp}</span>
                  </>
                )}
                {Number(userPrediction.points_multiplier) === 2 && (
                  <span className="ml-1.5 font-black text-amber-300">×2</span>
                )}
              </div>
            )}
          </>
        ) : canEditPrediction ? (
          <>
            {hasUserPrediction && userPrediction && !showPredictionEditor ? (
              <SavedPredictionPanel
                match={match}
                pred={userPrediction}
                kickoffTime={match.kickoff_time}
                onEdit={() => setShowPredictionEditor(true)}
              />
            ) : (
              <InlinePredictForm
                key={`${match.id}-${predictionRowId ?? "new"}`}
                match={match}
                existing={userPrediction}
                predictionRowId={predictionRowId}
                powerUpActive={powerUpActive}
                onSave={(pred, rowId) => {
                  onPredictionSaved(pred, rowId)
                  setShowPredictionEditor(false)
                }}
                onCancel={hasUserPrediction ? () => setShowPredictionEditor(false) : undefined}
              />
            )}
          </>
        ) : (
          <>
            {hasUserPrediction && userPrediction ? (
              <SavedPredictionPanel
                match={match}
                pred={userPrediction}
                kickoffTime={match.kickoff_time}
              />
            ) : (
              <>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-1 flex justify-end min-w-0">
                    <TeamWithFlag
                      name={match.team1}
                      size="lg"
                      className="flex-row-reverse text-right max-w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center w-14 sm:w-16 shrink-0">
                    <span className="text-[11px] font-bold text-slate-400 bg-white/10 rounded-lg px-2.5 py-1 tracking-wider ring-1 ring-white/10">
                      VS
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <TeamWithFlag name={match.team2} size="lg" className="max-w-full" />
                  </div>
                </div>
                {showPredict && !signedIn && (
                  <p className="mt-3 text-xs text-slate-500 text-center sm:text-left">
                    Sign in to predict the score and MVP for this match.
                  </p>
                )}
                {predictClosed && showPredict && (
                  <p className="mt-3 text-xs text-slate-500 text-center sm:text-left">
                    Predictions are closed for this match.
                  </p>
                )}
              </>
            )}
          </>
        )}

        {showPowerStrip && (
          <div className="mt-4 flex justify-end">
            <div
              className={`rounded-xl border px-2 py-2 shadow-[0_0_16px_rgba(245,158,11,0.06)] w-fit max-w-[11rem] transition-opacity ${
                powerUpPhaseLocked && !powerUpActive
                  ? "border-slate-600/30 bg-slate-900/45 opacity-[0.72]"
                  : "border-amber-400/45 bg-amber-500/8"
              }`}
            >
              <div className="flex flex-col items-end gap-1.5">
                <p
                  className={`text-xl font-black leading-none tracking-tight ${
                    powerUpPhaseLocked && !powerUpActive ? "text-slate-500" : "text-amber-600"
                  }`}
                >
                  ×2
                </p>
                {!hasUserPrediction && powerUpActive ? (
                  <p className="text-[9px] font-medium leading-snug text-right text-amber-950/80">
                    <span className="text-amber-800">Applies when you save your prediction.</span>
                  </p>
                ) : null}
                <button
                  type="button"
                  role="switch"
                  aria-checked={powerUpActive}
                  disabled={powerUpBusy || (powerUpPhaseLocked && !powerUpActive)}
                  title={
                    powerUpPhaseLocked && !powerUpActive
                      ? "×2 already active on another match in this phase"
                      : undefined
                  }
                  onClick={() => {
                    if (powerUpBusy || (powerUpPhaseLocked && !powerUpActive)) return
                    onPowerUpToggle(!powerUpActive)
                  }}
                  className={`relative h-9 w-[4.25rem] shrink-0 rounded-full border-2 transition-all duration-200 ${
                    powerUpActive
                      ? "border-amber-500 bg-amber-600/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : powerUpPhaseLocked
                        ? "border-slate-600/50 bg-slate-800/50 cursor-not-allowed"
                        : "border-white/20 bg-slate-900/55"
                  } ${powerUpBusy ? "opacity-60 cursor-wait" : ""}`}
                >
                  <span
                    className={`absolute top-0.5 h-7 w-7 rounded-full shadow-md border transition-all duration-200 flex items-center justify-center text-[9px] font-black ${
                      powerUpActive
                        ? "right-0.5 bg-slate-200 border-white/25 text-slate-900"
                        : powerUpPhaseLocked
                          ? "left-0.5 bg-slate-600 border-slate-500/40 text-slate-300"
                          : "left-0.5 bg-slate-200 border-white/25 text-slate-900"
                    }`}
                  >
                    {powerUpBusy ? "…" : "×2"}
                  </span>
                </button>
              </div>
              {powerUpError && (
                <p className="mt-2 text-xs text-red-200 bg-red-500/15 border border-red-400/35 rounded-xl px-3 py-2 text-left">
                  {powerUpError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {showPredict && (
        <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-2">
          <Link
            href={matchViewHref}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 text-slate-400 px-3.5 py-2 text-xs font-semibold hover:bg-white/8 hover:border-cyan-400/25 hover:text-slate-200 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.002.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd"/></svg>
            View predictions
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Filter helpers ───────────────────────────────────────────────────────────

type Filter = "all" | "today" | "upcoming" | "past"
const SUB_ALL = "All"

function getTodayWindow(): { start: Date; end: Date } {
  // Use the user's local calendar day (00:00 → 24:00) so "Today" matches what
  // the user sees on their device clock, regardless of server timezone.
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
  return { start, end }
}

function isInTodayWindow(kickoffTime: string, window: { start: Date; end: Date }): boolean {
  const t = new Date(kickoffTime).getTime()
  return t >= window.start.getTime() && t <= window.end.getTime()
}

function getSubOptions(matches: Match[]): string[] {
  const groups = GROUP_ORDER.filter((g) => matches.some((m) => m.stage === "First Stage" && m.group === g))
  const stages = STAGE_ORDER.filter((s) => s !== "First Stage" && matches.some((m) => m.stage === s))
  if (groups.length === 0 && stages.length === 0) return []
  const groupRounds = groups.length > 0 ? [...GROUP_STAGE_ROUNDS] : []
  return [
    SUB_ALL,
    ...groups.map((g) => `Group ${g}`),
    ...groupRounds,
    ...stages,
  ]
}

function applySubFilter(matches: Match[], subFilter: string | null): Match[] {
  if (!subFilter || subFilter === SUB_ALL) return matches
  if (subFilter === "1st Round") return pickGroupStageRoundRange(matches, 0, 1)
  if (subFilter === "2nd Round") return pickGroupStageRoundRange(matches, 2, 3)
  if (subFilter === "3rd Round") return pickGroupStageRoundRange(matches, 4, 5)
  if (subFilter.startsWith("Group ")) {
    const g = subFilter.replace("Group ", "")
    return matches.filter((m) => m.stage === "First Stage" && m.group === g)
  }
  return matches.filter((m) => m.stage === subFilter)
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GamesList({ upcoming, past }: { upcoming: Match[]; past: Match[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState<Filter>("all")
  const [subFilter, setSubFilter] = useState<string | null>(null)
  const [matchIdsWithUserPrediction, setMatchIdsWithUserPrediction] = useState<Set<number>>(new Set())
  const [predictionsByMatch, setPredictionsByMatch] = useState<Map<number, UserPrediction>>(new Map())
  const [predictionRowIds, setPredictionRowIds] = useState<Map<number, number>>(new Map())
  const [signedIn, setSignedIn] = useState(false)
  const [powerUpIntent, setPowerUpIntent] = useState<Map<number, boolean>>(new Map())
  const [powerUpBusyId, setPowerUpBusyId] = useState<number | null>(null)
  const [powerUpErr, setPowerUpErr] = useState<{ mid: number; msg: string } | null>(null)

  function effectivePowerUp(matchId: number): boolean {
    const pred = predictionsByMatch.get(matchId)
    if (pred && Number(pred.points_multiplier) === 2) return true
    return powerUpIntent.get(matchId) === true
  }

  async function handleCardPowerUpToggle(match: Match, enabled: boolean) {
    if (!signedIn) return
    if (new Date(match.kickoff_time) <= new Date()) return
    setPowerUpBusyId(match.id)
    setPowerUpErr((e) => (e?.mid === match.id ? null : e))
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setPowerUpBusyId(null)
      return
    }

    // If another match in this phase is already holding ×2 and the user is
    // trying to enable here, offer to transfer instead of erroring out.
    if (enabled) {
      const bucket = powerUpBucketByMatchId.get(match.id) ?? "Other"
      const holderId = bucket !== "Other" ? phasePowerUpHolder.get(bucket) : undefined
      if (holderId != null && holderId !== match.id) {
        const holderMatch = allMatchesOrdered.find((m) => m.id === holderId)
        const holderLabel = holderMatch ? `${holderMatch.team1} vs ${holderMatch.team2}` : "another match"
        const ok = window.confirm(
          `×2 is currently active on ${holderLabel}. Move it to this match instead?`
        )
        if (!ok) {
          setPowerUpBusyId(null)
          return
        }
        // Clear the holder first.
        const holderRowId = predictionRowIds.get(holderId)
        if (holderRowId != null) {
          const { error: clearErr } = await supabase
            .from("predictions")
            .update({ points_multiplier: 1 })
            .eq("id", holderRowId)
            .eq("user_id", user.id)
          if (clearErr) {
            setPowerUpErr({ mid: match.id, msg: clearErr.message })
            setPowerUpBusyId(null)
            return
          }
          setPredictionsByMatch((prev) => {
            const p = prev.get(holderId)
            if (!p) return prev
            const n = new Map(prev)
            n.set(holderId, { ...p, points_multiplier: 1 })
            return n
          })
        }
        setPowerUpIntent((prev) => {
          const n = new Map(prev)
          n.delete(holderId)
          return n
        })
      }
    }

    const rowId = predictionRowIds.get(match.id)
    const v = await validatePowerUpPhase(supabase, {
      userId: user.id,
      targetMatch: {
        id: match.id,
        stage: match.stage ?? null,
        group: match.group ?? null,
        kickoff_time: match.kickoff_time,
      },
      enable: enabled,
      excludePredictionId: rowId ?? null,
    })
    if (!v.ok) {
      setPowerUpErr({ mid: match.id, msg: v.message })
      setPowerUpBusyId(null)
      return
    }
    if (rowId != null) {
      const { error } = await supabase
        .from("predictions")
        .update({ points_multiplier: enabled ? 2 : 1 })
        .eq("id", rowId)
        .eq("user_id", user.id)
      if (error) {
        setPowerUpErr({ mid: match.id, msg: error.message })
        setPowerUpBusyId(null)
        return
      }
      setPredictionsByMatch((prev) => {
        const p = prev.get(match.id)
        if (!p) return prev
        const n = new Map(prev)
        n.set(match.id, { ...p, points_multiplier: enabled ? 2 : 1 })
        return n
      })
    } else {
      setPowerUpIntent((prev) => {
        const n = new Map(prev)
        if (enabled) n.set(match.id, true)
        else n.delete(match.id)
        return n
      })
    }
    setPowerUpBusyId(null)
  }

  useEffect(() => {
    const f = searchParams.get("filter")
    const sub = searchParams.get("subFilter")
    const t = window.setTimeout(() => {
      if (f && (f === "all" || f === "today" || f === "upcoming" || f === "past")) setFilter(f as Filter)
      if (sub !== null && sub !== undefined) setSubFilter(sub || null)
    }, 0)
    return () => window.clearTimeout(t)
  }, [searchParams])

  const setFilterAndUrl = (f: Filter, sub: string | null) => {
    setFilter(f); setSubFilter(sub)
    const params = new URLSearchParams()
    params.set("filter", f)
    if (sub) params.set("subFilter", sub)
    router.replace(`/games?${params.toString()}`, { scroll: false })
  }

  const setSubFilterAndUrl = (sub: string | null) => {
    setSubFilter(sub)
    const params = new URLSearchParams()
    params.set("filter", filter)
    if (sub) params.set("subFilter", sub)
    router.replace(`/games?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSignedIn(false)
        setMatchIdsWithUserPrediction(new Set())
        setPredictionsByMatch(new Map())
        setPredictionRowIds(new Map())
        setPowerUpIntent(new Map())
        return
      }
      setSignedIn(true)
      const { data: rows } = await supabase
        .from("predictions")
        .select("id, match_id, pred_score1, pred_score2, pred_mvp, pred_qualifier, points, points_multiplier")
        .eq("user_id", user.id)
        .order("id", { ascending: false })
      const ids = new Set<number>()
      const byMatch = new Map<number, UserPrediction>()
      const rowIds = new Map<number, number>()
      for (const r of rows ?? []) {
        if (byMatch.has(r.match_id)) continue
        ids.add(r.match_id)
        byMatch.set(r.match_id, {
          pred_score1: r.pred_score1 ?? 0,
          pred_score2: r.pred_score2 ?? 0,
          pred_mvp: r.pred_mvp ?? null,
          pred_qualifier: r.pred_qualifier ?? null,
          points: r.points ?? null,
          points_multiplier: r.points_multiplier ?? null,
        })
        rowIds.set(r.match_id, r.id)
      }
      setMatchIdsWithUserPrediction(ids)
      setPredictionsByMatch(byMatch)
      setPredictionRowIds(rowIds)
    }
    load()
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh()
    }, 60_000)
    return () => window.clearInterval(t)
  }, [router])

  function handlePredictionSaved(matchId: number, pred: UserPrediction, rowId: number) {
    setPredictionsByMatch(prev => new Map(prev).set(matchId, pred))
    setMatchIdsWithUserPrediction(prev => new Set(prev).add(matchId))
    setPredictionRowIds(prev => new Map(prev).set(matchId, rowId))
    setPowerUpIntent((prev) => {
      const n = new Map(prev)
      n.delete(matchId)
      return n
    })
  }

  const allMatchesOrdered = useMemo(() => [...past, ...upcoming], [past, upcoming])

  const powerUpBucketByMatchId = useMemo(
    () => buildPowerUpBucketMap(allMatchesOrdered),
    [allMatchesOrdered]
  )

  const phasePowerUpHolder = useMemo(() => {
    const holder = new Map<PowerUpBucket, number>()
    function boosted(mid: number): boolean {
      const p = predictionsByMatch.get(mid)
      if (p && Number(p.points_multiplier) === 2) return true
      return powerUpIntent.get(mid) === true
    }
    for (const m of allMatchesOrdered) {
      if (!boosted(m.id)) continue
      const b = powerUpBucketByMatchId.get(m.id) ?? "Other"
      if (b === "Other") continue
      if (!holder.has(b)) holder.set(b, m.id)
    }
    return holder
  }, [allMatchesOrdered, powerUpBucketByMatchId, predictionsByMatch, powerUpIntent])

  // Phase-lock visual hint is no longer used: clicking the toggle on a locked
  // match now opens a confirm dialog to transfer ×2 from the holder.
  void phasePowerUpHolder

  const showUpcoming = filter === "all" || filter === "upcoming"
  const showPast = filter === "all" || filter === "past"

  const todayWindow = useMemo(() => getTodayWindow(), [])
  const todayMatches = useMemo(() => [...past, ...upcoming].filter((m) => isInTodayWindow(m.kickoff_time, todayWindow)), [past, upcoming, todayWindow])
  const visibleForSub = useMemo(() => {
    if (filter === "today") return todayMatches
    if (filter === "upcoming") return upcoming
    if (filter === "past") return past
    return [...past, ...upcoming]
  }, [filter, upcoming, past, todayMatches])

  const subOptions = useMemo(() => getSubOptions(visibleForSub), [visibleForSub])
  const upcomingFiltered = useMemo(() => applySubFilter(upcoming, subOptions.length ? subFilter : null), [upcoming, subFilter, subOptions.length])
  const pastFiltered = useMemo(() => applySubFilter(past, subOptions.length ? subFilter : null), [past, subFilter, subOptions.length])
  const todayFiltered = useMemo(() => applySubFilter(todayMatches, subOptions.length ? subFilter : null), [todayMatches, subFilter, subOptions.length])
  const upcomingSections = useMemo(() => matchesIntoKickoffOrderSections(upcomingFiltered), [upcomingFiltered])
  const pastSections = useMemo(() => matchesIntoKickoffOrderSections(pastFiltered), [pastFiltered])
  const todaySections = useMemo(() => matchesIntoKickoffOrderSections(todayFiltered), [todayFiltered])

  function renderSections(sections: Section[], showPredict: boolean | ((m: Match) => boolean)) {
    const getShowPredict = typeof showPredict === "function" ? showPredict : () => showPredict
    return sections.map((sec, secIdx) => (
      <section key={`${sec.stage}-${secIdx}`} className="mb-7">
        {sec.title ? (
          <div className="flex items-center gap-2.5 mb-3">
            {sec.isKnockout ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-wc-gold shrink-0" />
                <h2 className="text-sm font-bold text-wc-gold uppercase tracking-wider">{sec.title}</h2>
                {sec.stage === "Final" && (
                  <span className="rounded-full bg-wc-gold text-[#1a0f00] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">Final</span>
                )}
              </div>
            ) : (
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">{sec.title}</h2>
            )}
            <div className="flex-1 h-px bg-white/8" />
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 items-start">
          {sec.matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              showPredict={getShowPredict(match)}
              hasUserPrediction={matchIdsWithUserPrediction.has(match.id)}
              filterParam={filter}
              subFilterParam={subFilter ?? ""}
              userPrediction={predictionsByMatch.get(match.id)}
              predictionRowId={predictionRowIds.get(match.id)}
              onPredictionSaved={(pred, rowId) => handlePredictionSaved(match.id, pred, rowId)}
              signedIn={signedIn}
              powerUpActive={effectivePowerUp(match.id)}
              onPowerUpToggle={(en) => { void handleCardPowerUpToggle(match, en) }}
              powerUpBusy={powerUpBusyId === match.id}
              powerUpError={powerUpErr?.mid === match.id ? powerUpErr.msg : null}
              powerUpPhaseLocked={false}
            />
          ))}
        </div>
      </section>
    ))
  }

  const filterButtons: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
  ]

  return (
    <>
      {/* ── Main filter tabs ── */}
      <div className="flex flex-wrap gap-1.5 mb-4 p-1 glass-dark rounded-2xl border border-white/8 w-fit">
        {filterButtons.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setFilterAndUrl(key, null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === key
                ? "bg-wc-gold text-[#1a0f00] shadow-[0_2px_12px_rgba(240,180,41,0.4)]"
                : "text-white/60 hover:text-white/90 hover:bg-white/8"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Sub-filter chips ── */}
      {subOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          <span className="text-white/35 text-xs self-center mr-0.5">Filter:</span>
          {subOptions.map((opt) => (
            <button key={opt} type="button" onClick={() => setSubFilterAndUrl(opt === SUB_ALL ? null : opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                (opt === SUB_ALL && !subFilter) || subFilter === opt
                  ? "bg-wc-green text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)]"
                  : "glass border-white/12 text-slate-400 hover:bg-white/6"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {filter === "today" && (
        todayMatches.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white/80 mb-4">Today&apos;s matches</h2>
            {todayFiltered.length > 0
              ? renderSections(todaySections, (m) => new Date(m.kickoff_time) >= new Date())
              : <p className="text-white/40 text-sm">No matches today for this filter.</p>}
          </div>
        ) : <p className="text-white/50">No matches today.</p>
      )}

      {showUpcoming && upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white/80 mb-4">Upcoming matches</h2>
          {upcomingFiltered.length > 0
            ? renderSections(upcomingSections, true)
            : <p className="text-white/40 text-sm">No upcoming matches for this filter.</p>}
        </div>
      )}

      {showPast && past.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white/80 mb-4">Past matches</h2>
          {pastFiltered.length > 0
            ? renderSections(pastSections, false)
            : <p className="text-white/40 text-sm">No past matches for this filter.</p>}
        </div>
      )}

      {filter === "all" && upcoming.length === 0 && past.length === 0 && <p className="text-white/50">No matches yet.</p>}
      {filter === "upcoming" && upcoming.length === 0 && <p className="text-white/50">No upcoming matches.</p>}
      {filter === "past" && past.length === 0 && <p className="text-white/50">No past matches.</p>}
    </>
  )
}
