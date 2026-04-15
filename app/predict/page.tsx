"use client"

import { Suspense, useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TeamWithFlag } from "@/app/components/TeamWithFlag"
import { formatKickoffDisplay } from "@/lib/format-kickoff"
import { validatePowerUpPhase } from "@/lib/powerup-week-client"

const MVP_POS_ORDER: Record<string, number> = { gk: 1, df: 2, md: 3, st: 4 }

function PredictPageInner() {

  const searchParams = useSearchParams()
  const matchId = searchParams.get("match")

  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")
  const [mvp, setMvp] = useState("")
  const [mvpPlayers, setMvpPlayers] = useState<string[]>([])
  const [usePowerUp, setUsePowerUp] = useState(false)
  const [qualifier, setQualifier] = useState("")
  const [hasExistingPrediction, setHasExistingPrediction] = useState(false)
  const [existingPredictionId, setExistingPredictionId] = useState<number | null>(null)
  const [authed, setAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setAuthed(!!user))
  }, [])

  const isKnockout = useMemo(
    () => !!match && (match.stage ?? "") !== "First Stage",
    [match]
  )

  const predictedOutcomeLabel = useMemo(() => {
    if (!match) return ""

    const s1 = Number(score1)
    const s2 = Number(score2)

    if (!Number.isInteger(s1) || !Number.isInteger(s2)) {
      return ""
    }

    if (s1 > s2) {
      return `Final result: ${match.team1} wins`
    }

    if (s1 < s2) {
      return `Final result: ${match.team2} wins`
    }

    return "Final result: Draw"
  }, [match, score1, score2])

  useEffect(() => {
    async function loadMatch() {
      setLoading(true)
      const supabase = createClient()

      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single()
      setMatch(matchData)

      let squadNames: string[] = []
      if (matchData?.team1 && matchData?.team2) {
        const { data: roster } = await supabase
          .from("five_a_side_players")
          .select("name, team, position")
          .in("team", [matchData.team1, matchData.team2])
        const rows = roster ?? []
        rows.sort((a, b) => {
          const t1 = a.team === matchData.team1 ? 0 : 1
          const t2 = b.team === matchData.team1 ? 0 : 1
          if (t1 !== t2) return t1 - t2
          const pa = MVP_POS_ORDER[a.position] ?? 9
          const pb = MVP_POS_ORDER[b.position] ?? 9
          if (pa !== pb) return pa - pb
          return a.name.localeCompare(b.name)
        })
        squadNames = rows.map((r) => r.name)
        setMvpPlayers(squadNames)
      } else {
        setMvpPlayers([])
      }

      const { data: { user } } = await supabase.auth.getUser()
      let displayName = ""
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single()
        displayName = (profile?.display_name ?? "").trim()
      }

      let prediction: any = null
      if (user) {
        const { data } = await supabase
          .from("predictions")
          .select("*")
          .eq("match_id", matchId)
          .eq("user_id", user.id)
          .order("id", { ascending: false })
          .limit(1)
          .single()
        prediction = data
      } else {
        const { data } = await supabase
          .from("predictions")
          .select("*")
          .eq("match_id", matchId)
          .order("id", { ascending: false })
          .limit(1)
          .single()
        prediction = data
      }

      if (prediction) {
        if (!displayName) displayName = (prediction.user_name ?? "").trim() || ""
        setScore1(String(prediction.pred_score1 ?? ""))
        setScore2(String(prediction.pred_score2 ?? ""))
        const rawMvp = prediction.pred_mvp ?? ""
        setMvp(
          squadNames.length > 0
            ? squadNames.includes(rawMvp)
              ? rawMvp
              : ""
            : rawMvp
        )
        setQualifier(prediction.pred_qualifier ?? "")
        const pm = Number((prediction as { points_multiplier?: number }).points_multiplier)
        setUsePowerUp(pm === 2)
      }
      setName(displayName)
      const isOwn = !!(user && prediction && prediction.user_id === user.id)
      setHasExistingPrediction(isOwn)
      setExistingPredictionId(isOwn && prediction?.id != null ? prediction.id : null)

      setLoading(false)
    }

    if (matchId) {
      loadMatch()
    }
  }, [matchId])

  const needsQualifier = useMemo(() => {
    if (!isKnockout) return false
    const s1 = Number(score1)
    const s2 = Number(score2)
    if (!Number.isInteger(s1) || !Number.isInteger(s2)) return false
    return s1 === s2
  }, [isKnockout, score1, score2])

  const backToJogosUrl = useMemo(() => {
    const f = searchParams.get("filter") ?? "all"
    const sub = searchParams.get("subFilter") ?? ""
    return `/jogos?filter=${encodeURIComponent(f)}${sub ? `&subFilter=${encodeURIComponent(sub)}` : ""}`
  }, [searchParams])

  const knockoutHasDecidedWinner = useMemo(() => {
    if (!isKnockout) return false
    const s1 = Number(score1)
    const s2 = Number(score2)
    if (!Number.isInteger(s1) || !Number.isInteger(s2)) return false
    return s1 !== s2
  }, [isKnockout, score1, score2])

  // When there is a clear winner in a knockout match, automatically lock qualifier to that team
  useEffect(() => {
    if (!isKnockout) return
    if (!knockoutHasDecidedWinner) return
    const s1 = Number(score1)
    const s2 = Number(score2)
    if (!Number.isInteger(s1) || !Number.isInteger(s2)) return
    const winner = s1 > s2 ? match?.team1 : match?.team2
    if (winner && qualifier !== winner) {
      setQualifier(winner)
    }
  }, [isKnockout, knockoutHasDecidedWinner, score1, score2, match?.team1, match?.team2, qualifier])

  async function savePrediction() {

    if (!match) {
      return
    }

    const now = new Date()
    const kickoff = new Date(match.kickoff_time)

    if (kickoff <= now) {
      alert("Predictions are closed for this match.")
      return
    }

    if (!name.trim() || !mvp.trim()) {
      alert("Please fill in your name and the MVP.")
      return
    }

    const s1 = Number(score1)
    const s2 = Number(score2)

    if (!Number.isInteger(s1) || !Number.isInteger(s2) || s1 < 0 || s2 < 0) {
      alert("Scores must be integers greater than or equal to 0.")
      return
    }

    if (isKnockout && s1 === s2 && !qualifier) {
      alert("For knockout matches that are a draw after 90 minutes, please select who qualifies.")
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const mult = user && usePowerUp ? 2 : 1
    if (user && mult === 2) {
      const phaseCheck = await validatePowerUpPhase(supabase, {
        userId: user.id,
        targetMatch: {
          id: Number(match.id),
          stage: match.stage ?? null,
          group: match.group ?? null,
          kickoff_time: match.kickoff_time,
        },
        enable: true,
        excludePredictionId: existingPredictionId,
      })
      if (!phaseCheck.ok) {
        alert(phaseCheck.message)
        return
      }
    }

    let effectiveQualifier: string | null = null
    if (isKnockout) {
      if (s1 === s2) {
        effectiveQualifier = qualifier || null
      } else {
        effectiveQualifier = s1 > s2 ? match.team1 : match.team2
      }
    }
    const filter = searchParams.get("filter") ?? "all"
    const subFilter = searchParams.get("subFilter") ?? ""
    const returnUrl = `/jogos?filter=${encodeURIComponent(filter)}${subFilter ? `&subFilter=${encodeURIComponent(subFilter)}` : ""}`
    const matchIdNum = Number(matchId)

    if (user && existingPredictionId != null) {
      const id = Number(existingPredictionId)
      const { data: updated, error } = await supabase
        .from("predictions")
        .update({
          pred_score1: s1,
          pred_score2: s2,
          pred_mvp: mvp,
          pred_qualifier: effectiveQualifier,
          points_multiplier: mult,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id")
      if (error) {
        alert("Error updating prediction: " + error.message)
        return
      }
      if (!updated || updated.length === 0) {
        alert("Could not update prediction. You can only edit your own prediction.")
        return
      }
      router.push(returnUrl)
    } else if (user) {
      const { error } = await supabase.from("predictions").insert({
        user_name: name,
        user_id: user.id,
        match_id: matchIdNum,
        pred_score1: s1,
        pred_score2: s2,
        pred_mvp: mvp,
        pred_qualifier: effectiveQualifier,
        points_multiplier: mult,
      })
      if (error) {
        alert("Error saving prediction")
      } else {
        router.push(returnUrl)
      }
    } else {
      const { error } = await supabase.from("predictions").insert({
        user_name: name,
        user_id: null,
        match_id: matchIdNum,
        pred_score1: s1,
        pred_score2: s2,
        pred_mvp: mvp,
        pred_qualifier: effectiveQualifier,
      })
      if (error) {
        alert("Error saving prediction")
      } else {
        router.push(returnUrl)
      }
    }
  
  }

  return (
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
          {hasExistingPrediction ? "Edit prediction" : "Make prediction"}
        </h1>
        <Link
          href={backToJogosUrl}
          className="inline-flex w-fit rounded-xl px-4 py-2.5 text-slate-300 hover:text-wc-gold hover:bg-white/10 text-sm font-medium transition-all page-intro-on-stadium"
        >
          ← Back to match list
        </Link>
      </div>

      {loading && (
        <p className="text-wc-green-dark/80 mb-4 text-lg">Loading match and prediction...</p>
      )}

      {match && !loading && (
        <div className="mb-6 glass rounded-2xl border border-emerald-500/25 p-5 shadow-lg">
          <h2 className="text-xl font-bold text-emerald-200 flex flex-wrap items-center gap-2">
            <TeamWithFlag name={match.team1} /> vs <TeamWithFlag name={match.team2} />
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            {formatKickoffDisplay(match.kickoff_time)}
          </p>
          {isKnockout && (
            <p className="mt-3 text-sm text-amber-200/95 rounded-xl bg-amber-500/10 border border-amber-400/30 px-3 py-2">
              Knockout match – if you predict a draw after 90 minutes, you&apos;ll also choose who qualifies.
            </p>
          )}
        </div>
      )}

      {match && !loading && authed && new Date(match.kickoff_time) > new Date() && (
        <div className="mb-6 max-w-md glass rounded-2xl border border-amber-400/40 px-5 py-4 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-none tracking-tight text-amber-300">×2</p>
              <p className="text-[11px] font-semibold text-amber-100/80 mt-2 max-w-sm">
                Double your points from this match when it settles. One ×2 per calendar week (Mon–Sun).
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={usePowerUp}
              onClick={() => setUsePowerUp((v) => !v)}
              className={`relative h-12 w-[5.5rem] shrink-0 rounded-full border-2 transition-all duration-200 ${
                usePowerUp
                  ? "border-amber-500 bg-amber-600/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "border-white/20 bg-slate-900/60"
              }`}
            >
              <span
                className={`absolute top-1 h-9 w-9 rounded-full bg-slate-200 shadow-md border border-white/20 transition-all duration-200 flex items-center justify-center text-[10px] font-black text-slate-900 ${
                  usePowerUp ? "right-1" : "left-1"
                }`}
              >
                ×2
              </span>
            </button>
          </div>
        </div>
      )}

      {!loading && (
      <div className="max-w-md glass rounded-2xl border border-emerald-500/25 p-6 shadow-lg space-y-5 overflow-hidden">
        <div>
          <label className="block text-xs font-semibold text-emerald-300/90 uppercase tracking-wider mb-1.5">Your name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-slate-900/50 cursor-not-allowed text-slate-300 font-medium"
            value={name}
            readOnly
            aria-label="Your name (from your account)"
          />
        </div>

        <div className="rounded-xl bg-slate-900/45 border border-emerald-500/20 p-4 space-y-3">
          <p className="text-sm font-semibold text-emerald-200">Score</p>
          <div className="flex gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-slate-400 mb-1 truncate" title={match?.team1}>{match?.team1}</span>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/35 focus:border-wc-gold bg-slate-900/80 text-slate-50 font-semibold text-center box-border"
                value={score1}
                min={0}
                onChange={(e) => setScore1(e.target.value)}
              />
            </div>
            <span className="self-center text-amber-300 font-bold text-lg pt-5">–</span>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-slate-400 mb-1 truncate" title={match?.team2}>{match?.team2}</span>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-cyan-500/25 rounded-xl focus:ring-2 focus:ring-wc-gold/35 focus:border-wc-gold bg-slate-900/80 text-slate-50 font-semibold text-center box-border"
                value={score2}
                min={0}
                onChange={(e) => setScore2(e.target.value)}
              />
            </div>
          </div>
        </div>

        {predictedOutcomeLabel && (
          <p className="text-lg font-semibold text-emerald-100 rounded-xl bg-emerald-500/10 border border-emerald-400/25 px-4 py-3 flex flex-wrap items-center gap-1.5">
            {predictedOutcomeLabel === "Final result: Draw" ? (
              <span className="text-amber-200">Final result: Draw</span>
            ) : (
              <>
                Final result:{" "}
                <TeamWithFlag
                  name={
                    Number(score1) > Number(score2)
                      ? match?.team1
                      : Number(score2) > Number(score1)
                        ? match?.team2
                        : null
                  }
                  suffix=" wins"
                />
              </>
            )}
          </p>
        )}

        {isKnockout && (
          <div className="rounded-xl bg-amber-500/8 border border-amber-400/25 p-4 space-y-2">
            <p className="text-xs text-amber-100/85">
              For knockout matches, the team that qualifies is the winner after 90 minutes. If your score is a draw, you must pick who qualifies.
            </p>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-amber-200">
                Team that qualifies
              </label>
              <select
                value={qualifier}
                onChange={(e) => setQualifier(e.target.value)}
                disabled={knockoutHasDecidedWinner}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold transition-colors ${
                  knockoutHasDecidedWinner
                    ? "bg-slate-900/50 text-slate-500 border-white/10"
                    : "bg-slate-900/80 border-amber-400/35 text-emerald-100"
                }`}
              >
                <option value="">— Select team —</option>
                <option value={match?.team1 ?? ""}>{match?.team1}</option>
                <option value={match?.team2 ?? ""}>{match?.team2}</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1.5">
            Predicted MVP
          </label>
          {mvpPlayers.length > 0 ? (
            <select
              className="select-modern w-full px-4 py-2.5 border-2 border-amber-400/35 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/80 text-emerald-100 font-medium"
              value={mvpPlayers.includes(mvp) ? mvp : ""}
              onChange={(e) => setMvp(e.target.value)}
            >
              <option value="">— Pick player (squads) —</option>
              {mvpPlayers.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          ) : loading ? (
            <p className="text-sm text-slate-400 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3">
              Loading squad players…
            </p>
          ) : (
            <input
              type="text"
              placeholder="Predicted MVP (player name)"
              className="w-full px-4 py-2.5 border-2 border-amber-400/35 rounded-xl focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold bg-slate-900/80 text-emerald-100 placeholder:text-slate-500"
              value={mvp}
              onChange={(e) => setMvp(e.target.value)}
            />
          )}
          <p className="text-[11px] text-slate-500 mt-1">
            MVP must match the official match MVP text when results are entered.
          </p>
        </div>

        {match && new Date(match.kickoff_time) <= new Date() && (
          <p className="text-red-200 text-sm rounded-xl bg-red-500/12 border border-red-400/30 px-4 py-3 font-medium">
            Predictions are closed for this match.
          </p>
        )}

        <button
          onClick={savePrediction}
          className="w-full py-3.5 px-4 btn-primary disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none text-base font-semibold"
          disabled={
            !match ||
            new Date(match.kickoff_time) <= new Date()
          }
        >
          {hasExistingPrediction ? "Save changes" : "Save prediction"}
        </button>
      </div>
      )}

    </main>
  )
}

export default function PredictPage() {
  return (
    <Suspense fallback={<main className="text-white/50 text-sm">Loading prediction…</main>}>
      <PredictPageInner />
    </Suspense>
  )
}