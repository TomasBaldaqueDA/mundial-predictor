"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/app/components/PageHeader"
import { getFlagSrc } from "@/lib/team-flags"
import { FlagImage } from "@/app/components/FlagImage"
import { getKitForTeam, kitShirtBackground, squadShirtNumbers, type KitStyle } from "@/lib/team-kit"
import {
  fetchAllFiveASidePlayers,
  isCaptainLocked,
  slotFantasyPoints,
  statsFromPlayer,
  supersubInDeltaDisplay,
  supersubOutFrozenDisplay,
  teamFantasyPoints,
  type FiveASidePicks,
  type SlotKey,
} from "@/lib/five-a-side"
import { getSupersubButtonState, type MatchForSupersubWindow } from "@/lib/five-a-side-window"

type Player = {
  id: string
  name: string
  team: string
  position: string
  jersey_number?: number | null
  goals: number
  assists: number
  wins: number
  clean_sheets: number
  mvp: number
}

type Picks = FiveASidePicks

const POSITION_LABELS: Record<string, string> = {
  gk: "Goalkeeper",
  df: "Defender",
  md: "Midfielder",
  st: "Forward",
}

const SLOT_KEYS = ["gk", "df", "md1", "md2", "st"] as const

const SLOT_POSITION: Record<SlotKey, string> = {
  gk: "gk",
  df: "df",
  md1: "md",
  md2: "md",
  st: "st",
}

/** Left-to-right display order (back → front). */
const LINEUP_SLOTS: { slot: SlotKey; badge: string }[] = [
  { slot: "gk", badge: "GK" },
  { slot: "df", badge: "DF" },
  { slot: "md1", badge: "MF" },
  { slot: "md2", badge: "MF" },
  { slot: "st", badge: "FW" },
]

export function pickIdForSlot(picks: Picks | null, slot: SlotKey): string | null {
  if (!picks) return null
  switch (slot) {
    case "gk":
      return picks.gk_player_id
    case "df":
      return picks.df_player_id
    case "md1":
      return picks.md1_player_id
    case "md2":
      return picks.md2_player_id
    case "st":
      return picks.st_player_id
    default:
      return null
  }
}

/** National teams already chosen in other slots (current slot excluded so you can re-pick the same nation there). */
export function teamsUsedExceptSlot(exclude: SlotKey, picks: Picks | null, players: Player[]): Set<string> {
  const out = new Set<string>()
  if (!picks) return out
  for (const s of SLOT_KEYS) {
    if (s === exclude) continue
    const id = pickIdForSlot(picks, s)
    if (!id) continue
    const p = players.find((x) => x.id === id)
    if (p) out.add(p.team)
  }
  return out
}

export default function FiveASidePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playersByPosition, setPlayersByPosition] = useState<Record<string, Player[]>>({ gk: [], df: [], md: [], st: [] })
  const [firstMatchKickoff, setFirstMatchKickoff] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [picks, setPicks] = useState<Picks | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [modalSlot, setModalSlot] = useState<SlotKey | null>(null)
  const [teamFilter, setTeamFilter] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  /** Finished matches per national team (for GP). */
  const [teamGpByTeam, setTeamGpByTeam] = useState<Record<string, number>>({})
  const [tournamentMatches, setTournamentMatches] = useState<MatchForSupersubWindow[]>([])
  const [supersubModalSlot, setSupersubModalSlot] = useState<SlotKey | null>(null)
  const [supersubSlotPickerOpen, setSupersubSlotPickerOpen] = useState(false)

  const hasAnyPick = (row: Picks | null): boolean => {
    if (!row) return false
    return !!(
      row.gk_player_id ||
      row.df_player_id ||
      row.md1_player_id ||
      row.md2_player_id ||
      row.st_player_id
    )
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [
        playersData,
        { data: { user: u } },
        { data: firstMatch },
        { data: finishedRows },
        { data: scheduleRows },
      ] = await Promise.all([
        fetchAllFiveASidePlayers(
          supabase,
          "id, name, team, position, jersey_number, goals, assists, wins, clean_sheets, mvp"
        ),
        supabase.auth.getUser(),
        supabase.from("matches").select("kickoff_time").order("kickoff_time", { ascending: true }).limit(1).maybeSingle(),
        supabase.from("matches").select("team1, team2").eq("status", "finished"),
        supabase.from("matches").select("id, stage, group, kickoff_time, status").order("kickoff_time"),
      ])
      const gp: Record<string, number> = {}
      for (const row of finishedRows ?? []) {
        const m = row as { team1?: string | null; team2?: string | null }
        if (m.team1) gp[m.team1] = (gp[m.team1] ?? 0) + 1
        if (m.team2) gp[m.team2] = (gp[m.team2] ?? 0) + 1
      }
      setTeamGpByTeam(gp)
      setTournamentMatches((scheduleRows ?? []) as MatchForSupersubWindow[])
      const list = (playersData ?? []).map((p: Record<string, unknown>) => ({
        ...p,
        goals: Number(p.goals) || 0,
        assists: Number(p.assists) || 0,
        wins: Number(p.wins) || 0,
        clean_sheets: Number(p.clean_sheets) || 0,
        mvp: Number(p.mvp) || 0,
      })) as Player[]
      setPlayers(list)
      const byPos: Record<string, Player[]> = { gk: [], df: [], md: [], st: [] }
      for (const p of list) {
        if (byPos[p.position]) byPos[p.position].push(p)
      }
      setPlayersByPosition(byPos)
      setUser(u ?? null)
      if (firstMatch?.kickoff_time) setFirstMatchKickoff(firstMatch.kickoff_time as string)

      if (u) {
        const { data: picksRow } = await supabase
          .from("five_a_side_picks")
          .select(
            "gk_player_id, df_player_id, md1_player_id, md2_player_id, st_player_id, submitted_at, captain_player_id, captain_set_at, supersub_slot, supersub_out_player_id, supersub_in_player_id, supersub_applied_at, supersub_out_stats, supersub_in_baseline"
          )
          .eq("user_id", u.id)
          .maybeSingle()
        const initialPicks = (picksRow as Picks | null) ?? null
        setPicks(initialPicks)
        // If user has no saved team yet, start directly in edit mode.
        // Once a team exists, default to view mode (Edit team button visible).
        if (!hasAnyPick(initialPicks)) {
          setIsEditing(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const firstKickoffDate = firstMatchKickoff ? new Date(firstMatchKickoff) : null
  const lockedByTime = firstKickoffDate ? new Date() >= firstKickoffDate : false
  // The Rules page documents that the team locks at the first match kickoff,
  // not at first submit, so users can keep editing until then.
  const submittedAt = picks?.submitted_at ?? null

  const getPlayerId = (slot: SlotKey): string | null => {
    if (!picks) return null
    const key = slot === "md1" ? "md1_player_id" : slot === "md2" ? "md2_player_id" : `${slot}_player_id`
    return (picks as Record<string, string | null>)[key] ?? null
  }

  const getPlayer = (slot: SlotKey): Player | null => {
    const id = getPlayerId(slot)
    if (!id) return null
    return players.find((p) => p.id === id) ?? null
  }

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players])
  const shirtNumberByPlayerId = useMemo(() => squadShirtNumbers(players), [players])
  const teamComplete = !!(getPlayerId("gk") && getPlayerId("df") && getPlayerId("md1") && getPlayerId("md2") && getPlayerId("st"))
  const tournamentStarted = lockedByTime
  const slotsLocked = tournamentStarted || !isEditing
  const captainLocked = isCaptainLocked(tournamentStarted)
  const supersubApplied = !!picks?.supersub_applied_at
  const supersubState = getSupersubButtonState(tournamentMatches, {
    teamComplete,
    supersubApplied,
  })
  const supersubWindowOpen = supersubState.canUse
  const canPickCaptain = teamComplete && !tournamentStarted
  const showCaptainButtons = canPickCaptain && isEditing
  const captainId = picks?.captain_player_id ?? null

  const getPointsForSlot = (slot: SlotKey): number => slotFantasyPoints(picks, slot, playersById)
  const totalPoints = teamFantasyPoints(picks, playersById)

  async function savePick(slot: SlotKey, playerId: string) {
    if (!user || tournamentStarted) return
    const chosen = players.find((x) => x.id === playerId)
    if (!chosen) return
    if (teamsUsedExceptSlot(slot, picks, players).has(chosen.team)) {
      setMessage({ type: "error", text: "Only one player per nation. Pick someone from a country you have not used yet." })
      return
    }
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const key = slot === "md1" ? "md1_player_id" : slot === "md2" ? "md2_player_id" : `${slot}_player_id`
    const clearsCaptain = picks?.captain_player_id === getPlayerId(slot) && playerId !== getPlayerId(slot)
    const payload = {
      user_id: user.id,
      gk_player_id: getPlayerId("gk"),
      df_player_id: getPlayerId("df"),
      md1_player_id: getPlayerId("md1"),
      md2_player_id: getPlayerId("md2"),
      st_player_id: getPlayerId("st"),
      updated_at: new Date().toISOString(),
      ...{ [key]: playerId },
      ...(clearsCaptain ? { captain_player_id: null, captain_set_at: null } : {}),
    }
    const { error } = await supabase.from("five_a_side_picks").upsert(payload, { onConflict: "user_id" })
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setPicks((prev) => ({
        ...(prev ?? { gk_player_id: null, df_player_id: null, md1_player_id: null, md2_player_id: null, st_player_id: null, submitted_at: null }),
        [key]: playerId,
        ...(clearsCaptain ? { captain_player_id: null, captain_set_at: null } : {}),
      }))
      setModalSlot(null)
    }
    setSaving(false)
  }

  async function saveTeam() {
    if (!user || tournamentStarted || !teamComplete) return
    const gk = getPlayerId("gk")
    const df = getPlayerId("df")
    const md1 = getPlayerId("md1")
    const md2 = getPlayerId("md2")
    const st = getPlayerId("st")
    if (!gk || !df || !md1 || !md2 || !st) {
      setMessage({ type: "error", text: "Pick all 5 players before saving." })
      return
    }
    const nationList = [gk, df, md1, md2, st]
      .map((id) => players.find((p) => p.id === id)?.team)
      .filter((t): t is string => !!t)
    if (nationList.length === 5 && new Set(nationList).size !== 5) {
      setMessage({
        type: "error",
        text: "Only one player per nation. Change one pick so all five countries are different before saving.",
      })
      return
    }
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase
      .from("five_a_side_picks")
      .upsert(
        {
          user_id: user.id,
          gk_player_id: gk,
          df_player_id: df,
          md1_player_id: md1,
          md2_player_id: md2,
          st_player_id: st,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setPicks((prev) => (prev ? { ...prev, submitted_at: new Date().toISOString() } : null))
      setMessage({ type: "ok", text: "Team saved and locked." })
      setIsEditing(false)
    }
    setSaving(false)
  }

  async function setCaptain(playerId: string) {
    if (!user || !showCaptainButtons) return
    const lineupIds = SLOT_KEYS.map((s) => getPlayerId(s)).filter(Boolean)
    if (!lineupIds.includes(playerId)) return
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const now = new Date().toISOString()
    const { error } = await supabase.from("five_a_side_picks").upsert(
      {
        user_id: user.id,
        gk_player_id: getPlayerId("gk"),
        df_player_id: getPlayerId("df"),
        md1_player_id: getPlayerId("md1"),
        md2_player_id: getPlayerId("md2"),
        st_player_id: getPlayerId("st"),
        captain_player_id: playerId,
        captain_set_at: now,
        updated_at: now,
      },
      { onConflict: "user_id" }
    )
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setPicks((prev) =>
        prev
          ? { ...prev, captain_player_id: playerId, captain_set_at: now }
          : {
              gk_player_id: getPlayerId("gk"),
              df_player_id: getPlayerId("df"),
              md1_player_id: getPlayerId("md1"),
              md2_player_id: getPlayerId("md2"),
              st_player_id: getPlayerId("st"),
              submitted_at: null,
              captain_player_id: playerId,
              captain_set_at: now,
            }
      )
      setMessage({ type: "ok", text: "Captain updated — locked at first match kickoff." })
    }
    setSaving(false)
  }

  async function clearCaptain() {
    if (!user || tournamentStarted || !picks?.captain_player_id || !isEditing) return
    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const now = new Date().toISOString()
    const { error } = await supabase.from("five_a_side_picks").upsert(
      {
        user_id: user.id,
        gk_player_id: getPlayerId("gk"),
        df_player_id: getPlayerId("df"),
        md1_player_id: getPlayerId("md1"),
        md2_player_id: getPlayerId("md2"),
        st_player_id: getPlayerId("st"),
        captain_player_id: null,
        captain_set_at: null,
        updated_at: now,
      },
      { onConflict: "user_id" }
    )
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setPicks((prev) => (prev ? { ...prev, captain_player_id: null, captain_set_at: null } : null))
      setMessage({ type: "ok", text: "Captain removed." })
    }
    setSaving(false)
  }

  async function applySupersub(slot: SlotKey, inPlayerId: string) {
    if (!user || !supersubWindowOpen) return
    const outPlayerId = getPlayerId(slot)
    if (!outPlayerId || outPlayerId === inPlayerId) return
    const outPlayer = players.find((p) => p.id === outPlayerId)
    const inPlayer = players.find((p) => p.id === inPlayerId)
    if (!outPlayer || !inPlayer) return
    if (inPlayer.position !== outPlayer.position) {
      setMessage({ type: "error", text: "Supersub must be the same position." })
      return
    }
    const nationsUsed = teamsUsedExceptSlot(slot, picks, players)
    if (nationsUsed.has(inPlayer.team)) {
      setMessage({ type: "error", text: "Only one player per nation. Pick someone from a country you have not used yet." })
      return
    }

    setSaving(true)
    setMessage(null)
    const supabase = createClient()
    const now = new Date().toISOString()
    const outStats = statsFromPlayer(outPlayer)
    const inBaseline = statsFromPlayer(inPlayer)
    const slotKey =
      slot === "md1" ? "md1_player_id" : slot === "md2" ? "md2_player_id" : `${slot}_player_id`

    const { error } = await supabase.from("five_a_side_picks").upsert(
      {
        user_id: user.id,
        gk_player_id: getPlayerId("gk"),
        df_player_id: getPlayerId("df"),
        md1_player_id: getPlayerId("md1"),
        md2_player_id: getPlayerId("md2"),
        st_player_id: getPlayerId("st"),
        [slotKey]: inPlayerId,
        supersub_slot: slot,
        supersub_out_player_id: outPlayerId,
        supersub_in_player_id: inPlayerId,
        supersub_applied_at: now,
        supersub_out_stats: outStats,
        supersub_in_baseline: inBaseline,
        updated_at: now,
      },
      { onConflict: "user_id" }
    )
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setPicks((prev) =>
        prev
          ? {
              ...prev,
              [slotKey]: inPlayerId,
              supersub_slot: slot,
              supersub_out_player_id: outPlayerId,
              supersub_in_player_id: inPlayerId,
              supersub_applied_at: now,
              supersub_out_stats: outStats,
              supersub_in_baseline: inBaseline,
            }
          : null
      )
      setSupersubModalSlot(null)
      setMessage({ type: "ok", text: "Supersub applied — locked for the rest of the tournament." })
    }
    setSaving(false)
  }

  const modalPlayers = modalSlot ? playersByPosition[SLOT_POSITION[modalSlot]] ?? [] : []
  const filteredModalPlayers = teamFilter
    ? modalPlayers.filter((p) => p.team.toLowerCase().includes(teamFilter.toLowerCase()))
    : modalPlayers
  const nationsTakenElsewhere = modalSlot ? teamsUsedExceptSlot(modalSlot, picks, players) : new Set<string>()

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50">Loading 5-A-SIDE…</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4">
      <PageHeader
        title="5-A-SIDE"
        description="Pick 1 GK, 1 DF, 2 MF, 1 FW — max one player per nation. Locked at first match or when you submit."
      >
        {tournamentStarted ? (
          <Link href="/five-a-side/teams" className="btn-secondary text-sm py-2 px-4">
            View teams
          </Link>
        ) : (
          <span
            className="btn-secondary text-sm py-2 px-4 opacity-50 cursor-not-allowed"
            title="Available when the World Cup starts"
          >
            View teams
          </span>
        )}
      </PageHeader>

      {!user && (
        <div className="glass rounded-2xl p-6 text-center border border-wc-gold/25 mb-6">
          <p className="text-slate-300 mb-4">Sign in to pick your 5-a-side team.</p>
          <Link href="/login" className="btn-primary inline-block">
            Sign in
          </Link>
        </div>
      )}

      {lockedByTime && (
        <div className="glass rounded-xl px-4 py-2 mb-4 border border-wc-gold/40 text-center">
          <span className="font-medium text-wc-gold">Team locked</span>
          <span className="text-slate-400 ml-1">(World Cup started)</span>
        </div>
      )}
      {!!submittedAt && !lockedByTime && (
        <div className="glass rounded-xl px-4 py-2 mb-4 border border-wc-green/30 text-center">
          <span className="font-medium text-wc-green-dark">Team submitted</span>
          <span className="text-slate-400 ml-1">— you can still edit until the first match</span>
        </div>
      )}

      {message && (
        <div
          className={`rounded-xl px-4 py-2 mb-4 text-center ${message.type === "ok" ? "bg-wc-green-light/60 text-wc-green-dark" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {user && (getPlayerId("gk") ?? getPlayerId("df") ?? getPlayerId("md1") ?? getPlayerId("md2") ?? getPlayerId("st")) && (
        <div className="glass rounded-xl px-4 py-2 mb-4 border border-wc-gold/25 text-center space-y-1">
          <span className="font-medium text-wc-green-dark">Total points: {totalPoints}</span>
          {captainId && (
            <p className="text-xs text-slate-400">
              Captain: {playersById.get(captainId)?.name ?? "—"} (×2 pts
              {captainLocked ? ", locked" : " — change until first match"})
            </p>
          )}
          {supersubApplied && picks?.supersub_out_player_id && picks?.supersub_in_player_id && (
            <p className="text-xs text-slate-400">
              Supersub: {playersById.get(picks.supersub_out_player_id)?.name ?? "—"} →{" "}
              {playersById.get(picks.supersub_in_player_id)?.name ?? "—"}
            </p>
          )}
        </div>
      )}

      {user && teamComplete && showCaptainButtons && (
        <div className="glass rounded-xl px-4 py-3 mb-4 border border-amber-400/30 text-center">
          <p className="text-sm text-amber-100/90 mb-1">Choose your captain (×2 points for the whole tournament)</p>
          <p className="text-xs text-slate-400">
            Set or change captain on any player below until the first match. Use &quot;Remove captain&quot; to clear.
          </p>
        </div>
      )}

      {user && (teamComplete || supersubApplied) && (
        <div
          className={`glass rounded-xl px-4 py-3 mb-4 text-center border ${
            supersubWindowOpen
              ? "border-cyan-400/40"
              : supersubApplied
                ? "border-emerald-400/30"
                : "border-white/10"
          }`}
        >
          <p className="text-sm font-semibold text-cyan-100">Supersub</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            One substitution for the whole tournament — same position, new nation. Available only after group stage
            round 3 ends and before Round of 32 kicks off.
          </p>
          {supersubApplied && picks?.supersub_out_player_id && picks?.supersub_in_player_id ? (
            <p className="mt-3 text-sm font-medium text-emerald-200">
              Used: {playersById.get(picks.supersub_out_player_id)?.name ?? "—"} →{" "}
              {playersById.get(picks.supersub_in_player_id)?.name ?? "—"}
            </p>
          ) : (
            <>
              {supersubState.lockReason && (
                <p className="mt-2 text-xs text-amber-200/90">{supersubState.lockReason}</p>
              )}
              <button
                type="button"
                disabled={!supersubWindowOpen || saving}
                onClick={() => setSupersubSlotPickerOpen(true)}
                className={`mt-3 rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${
                  supersubWindowOpen
                    ? "bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 shadow-lg shadow-cyan-900/30 hover:from-cyan-300 hover:to-cyan-500"
                    : "bg-white/5 text-white/35 cursor-not-allowed border border-white/10"
                }`}
              >
                Use supersub
              </button>
            </>
          )}
        </div>
      )}

      {/* Horizontal lineup — trading-card style */}
      <div className="relative mb-8 rounded-3xl overflow-hidden border border-cyan-400/15 bg-gradient-to-b from-[#121a2e] via-[#0a1020] to-[#020617] shadow-[0_4px_32px_rgba(0,0,0,0.48),0_0_48px_rgba(34,211,238,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]">
        {/* Pitch perspective + chevron noise */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(105deg, transparent 40%, rgba(34, 211, 238, 0.2) 40.5%, rgba(34, 211, 238, 0.2) 42%, transparent 42.5%),
              linear-gradient(-105deg, transparent 40%, rgba(56, 189, 248, 0.14) 40.5%, rgba(56, 189, 248, 0.14) 42%, transparent 42.5%)
            `,
            backgroundSize: "100% 55%",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,255,255,.12) 6px, rgba(255,255,255,.12) 7px)`,
          }}
        />

        <div className="relative flex flex-row flex-nowrap justify-start md:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-6 sm:py-8 px-4 sm:px-6 pb-8 [scrollbar-width:thin] snap-x snap-mandatory md:snap-none">
          {LINEUP_SLOTS.map(({ slot, badge }) => {
            const player = getPlayer(slot)
            const points = getPointsForSlot(slot)
            const isCaptain = !!(player && captainId === player.id)
            const supersubOnSlot = supersubApplied && picks?.supersub_slot === slot
            const subbedOut = supersubOnSlot ? supersubOutFrozenDisplay(picks, playersById) : null
            const subbedIn = supersubOnSlot ? supersubInDeltaDisplay(picks, playersById) : null
            const displayPlayer = subbedIn?.player ?? player
            const status: "empty" | "editing" | "filled" | "locked" = !player
              ? "empty"
              : tournamentStarted
                ? "locked"
                : isEditing
                  ? "editing"
                  : "filled"
            return (
              <div key={slot} className="flex flex-col items-center gap-2.5 shrink-0 snap-center first:pl-1 last:pr-1">
                {subbedOut && (
                  <>
                    <FantasyPlayerCard
                      slot={slot}
                      badge={badge}
                      player={subbedOut.player}
                      shirtNumber={shirtNumberByPlayerId.get(subbedOut.player.id) ?? 1}
                      teamGamesPlayed={teamGpByTeam[subbedOut.player.team] ?? 0}
                      locked
                      status="locked"
                      isPickerOpen={false}
                      isCaptain={captainId === subbedOut.player.id}
                      variant="substituted-out"
                      onChoose={() => {}}
                    />
                    <PointsBadge points={subbedOut.points} filled caption="until sub" subdued />
                    <span className="text-cyan-400/60 text-[10px] leading-none" aria-hidden>
                      ↓
                    </span>
                  </>
                )}
                <FantasyPlayerCard
                  slot={slot}
                  badge={badge}
                  player={displayPlayer}
                  shirtNumber={player ? (shirtNumberByPlayerId.get(player.id) ?? 1) : 0}
                  teamGamesPlayed={player ? (teamGpByTeam[player.team] ?? 0) : 0}
                  locked={slotsLocked}
                  status={status}
                  isPickerOpen={modalSlot === slot}
                  isCaptain={isCaptain}
                  variant={supersubOnSlot ? "supersub-in" : "active"}
                  onChoose={() => setModalSlot(slot)}
                />
                {supersubOnSlot && subbedIn && (
                  <PointsBadge points={subbedIn.points} filled caption="from R32" />
                )}
                {showCaptainButtons && player && !isCaptain && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setCaptain(player.id)}
                    className="rounded-lg border border-amber-400/50 bg-amber-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100 hover:bg-amber-500/25"
                  >
                    Set captain
                  </button>
                )}
                {showCaptainButtons && player && isCaptain && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={clearCaptain}
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-200 hover:bg-white/15"
                  >
                    Remove captain
                  </button>
                )}
                <PointsBadge points={points} filled={!!player} caption={supersubOnSlot ? "slot total" : undefined} />
              </div>
            )
          })}
        </div>
        <p className="pb-4 text-center text-[11px] text-slate-400 md:hidden">Swipe horizontally to view all 5 cards.</p>
      </div>

      {user && !tournamentStarted && (
        <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">
              Edit team
            </button>
          ) : (
            <button
              type="button"
              onClick={saveTeam}
              disabled={saving || !teamComplete}
              className="btn-primary"
            >
              {saving ? "Saving…" : "Save team"}
            </button>
          )}
        </div>
      )}

      <div className="text-center text-xs sm:text-sm text-stone-500 px-1 space-y-1">
        <p>
          Scoring: Goals 4 | Assists 3 | MVP 3 | Win 2 (player plays; incl. AET/PEN) | Clean sheet (GK/DF) 4 (0
          conceded; player plays; minutes irrelevant). Captain ×2. Supersub splits points at swap time.
        </p>
        <p>
          Card stats: G/A/CS/W/MVP from player rows; GP = finished World Cup matches for that nation. Lineup: each
          slot must be a different national team.
        </p>
      </div>

      {/* Supersub — pick which lineup slot to replace */}
      {supersubSlotPickerOpen && supersubWindowOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !saving && setSupersubSlotPickerOpen(false)}
        >
          <div
            className="glass rounded-2xl w-full max-w-sm border border-cyan-400/30 shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-wc-green-dark">Choose position to replace</h2>
              <button
                type="button"
                onClick={() => setSupersubSlotPickerOpen(false)}
                className="text-stone-500 hover:text-stone-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LINEUP_SLOTS.map(({ slot, badge }) => (
                <button
                  key={slot}
                  type="button"
                  disabled={saving || !getPlayer(slot)}
                  onClick={() => {
                    setSupersubSlotPickerOpen(false)
                    setSupersubModalSlot(slot)
                  }}
                  className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2.5 text-sm font-semibold text-cyan-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500/20"
                >
                  {badge}
                  {getPlayer(slot) ? (
                    <span className="block text-[10px] font-normal truncate mt-0.5 opacity-80">
                      {getPlayer(slot)?.name}
                    </span>
                  ) : (
                    <span className="block text-[10px] font-normal mt-0.5 opacity-60">Empty slot</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Supersub modal */}
      {supersubModalSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !saving && setSupersubModalSlot(null)}
        >
          <div
            className="glass rounded-2xl max-h-[80vh] w-full max-w-md flex flex-col border border-cyan-400/30 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-bold text-wc-green-dark">
                Supersub — replace {POSITION_LABELS[SLOT_POSITION[supersubModalSlot]]}
              </h2>
              <button type="button" onClick={() => setSupersubModalSlot(null)} className="text-stone-500 hover:text-stone-700">
                ×
              </button>
            </div>
            <p className="px-4 py-2 text-xs text-stone-500">
              Out: {getPlayer(supersubModalSlot)?.name ?? "—"}. Pick a replacement (same position, new nation).
            </p>
            <ul className="overflow-y-auto flex-1 p-2 space-y-1">
              {(playersByPosition[SLOT_POSITION[supersubModalSlot]] ?? [])
                .filter((p) => p.id !== getPlayerId(supersubModalSlot))
                .map((p) => {
                  const nationBlocked = teamsUsedExceptSlot(supersubModalSlot, picks, players).has(p.team)
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => applySupersub(supersubModalSlot, p.id)}
                        disabled={saving || nationBlocked}
                        className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          nationBlocked ? "cursor-not-allowed opacity-45" : "hover:bg-cyan-500/15"
                        }`}
                      >
                        <FlagImage src={getFlagSrc(p.team)} alt="" className="h-4 w-6 rounded object-cover shrink-0" />
                        <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                        <span className="ml-auto max-w-[45%] truncate text-stone-500 text-sm">{p.team}</span>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      )}

      {/* Pick player modal */}
      {modalSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !saving && setModalSlot(null)}
        >
          <div
            className="glass rounded-2xl max-h-[80vh] w-full max-w-md flex flex-col border border-wc-gold/25 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-bold text-wc-green-dark">Pick {POSITION_LABELS[SLOT_POSITION[modalSlot]]}</h2>
              <button type="button" onClick={() => setModalSlot(null)} className="text-stone-500 hover:text-stone-700">
                ×
              </button>
            </div>
            <div className="px-2 pb-1 space-y-1">
              <input
                type="text"
                placeholder="Filter by team..."
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <p className="text-xs text-stone-500 px-1">
                One player per nation across your five — countries already picked elsewhere are greyed out.
              </p>
            </div>
            <ul className="overflow-y-auto flex-1 p-2 space-y-1">
              {filteredModalPlayers.map((p) => {
                const nationBlocked = nationsTakenElsewhere.has(p.team)
                return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => savePick(modalSlot, p.id)}
                    disabled={saving || nationBlocked}
                    title={
                      nationBlocked
                        ? "That nation is already in your lineup. Choose a player from another country."
                        : undefined
                    }
                    className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      nationBlocked
                        ? "cursor-not-allowed opacity-45 hover:bg-transparent"
                        : "hover:bg-wc-green-light/50"
                    }`}
                  >
                    <span className="flex h-6 min-w-[1.35rem] items-center justify-center rounded bg-slate-800 text-[10px] font-black text-white tabular-nums shrink-0">
                      {shirtNumberByPlayerId.get(p.id) ?? "—"}
                    </span>
                    <FlagImage src={getFlagSrc(p.team)} alt="" className="h-4 w-6 rounded object-cover shrink-0" />
                    <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                    <span className="ml-auto max-w-[45%] truncate text-stone-500 text-sm">{p.team}</span>
                  </button>
                </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Text on kit back: real surnames, or placeholder "{Team} GK 1" from seed → "GK·1" (not the index as "name").
 */
function shirtBackNameLabel(fullName: string, team: string): string {
  const raw = fullName.trim()
  const teamNorm = team.trim().toLowerCase()

  // Seed format: "{Team name…} {POS} {n}" — match POS + number from the end (teams can be multi-word).
  const end = raw.match(/\s+(GK|DF|MD|MF|ST|FW)\s+(\d+)$/i)
  if (end && end.index !== undefined) {
    const prefix = raw.slice(0, end.index).trim()
    if (prefix.toLowerCase() === teamNorm) {
      const pos = end[1].toUpperCase()
      const idx = end[2]
      const line = `${pos}·${idx}`
      return line.length > 12 ? `${line.slice(0, 11)}…` : line
    }
  }

  const parts = raw.split(/\s+/).filter(Boolean)
  while (parts.length && /^\d+$/.test(parts[parts.length - 1]!)) parts.pop()
  while (parts.length && /^(GK|DF|MD|MF|ST|FW)$/i.test(parts[parts.length - 1]!)) parts.pop()
  if (parts.length === 0) return "PLAYER"

  const remainder = parts.join(" ")
  if (remainder.toLowerCase() === teamNorm) return team.slice(0, 3).toUpperCase() || "TEAM"

  const base = parts.length >= 2 ? parts[parts.length - 1]! : parts[0]!
  if (/^\d+$/.test(base)) {
    const fallback = parts.length >= 2 ? parts[parts.length - 2]! : "PLAYER"
    const u = fallback.toUpperCase()
    return u.length > 12 ? `${u.slice(0, 11)}…` : u
  }
  const u = base.toUpperCase()
  return u.length > 12 ? `${u.slice(0, 11)}…` : u
}

function KitShirtBack({
  kit,
  number,
  name,
  team,
  size = "default",
}: {
  kit: KitStyle
  number: number
  name: string
  team: string
  size?: "default" | "mini"
}) {
  const bg = kitShirtBackground(kit)
  const n = number < 1 ? 1 : number
  const label = n > 99 ? "99" : String(n)
  const nameLine = shirtBackNameLabel(name, team)
  const nameShadow = "0 0 3px #000, 0 1px 4px #000, 0 -1px 2px #000"
  const mini = size === "mini"

  return (
    <div
      className={
        mini
          ? "relative flex aspect-[4/5] w-[2.35rem] shrink-0 flex-col overflow-hidden rounded-t-[6px] border border-black/35 shadow-md"
          : "relative mx-2 mt-0.5 flex aspect-[4/5] max-h-[8rem] flex-col overflow-hidden rounded-t-[14px] border border-black/30 shadow-[inset_0_-16px_28px_rgba(0,0,0,0.18)]"
      }
    >
      <div className="absolute inset-0" style={bg} />
      <div
        className="absolute top-[16%] bottom-[14%] left-0 w-[11%] border-r border-black/15"
        style={{ backgroundColor: kit.secondary }}
      />
      <div
        className="absolute top-[16%] bottom-[14%] right-0 w-[11%] border-l border-black/15"
        style={{ backgroundColor: kit.secondary }}
      />
      <div className={`relative z-[1] flex justify-center ${mini ? "pt-0.5" : "pt-1.5"}`}>
        <div
          className={`rounded-b-md border border-black/25 shadow-sm ${mini ? "h-1 w-5" : "h-2 w-9"}`}
          style={{ background: kit.accent ?? kit.secondary }}
        />
      </div>
      <div className={`relative z-[1] flex min-h-0 flex-1 flex-col items-center ${mini ? "px-0.5 pb-0.5" : "px-1 pb-1.5"}`}>
        {!mini && (
          <span
            className="max-h-[2.75rem] w-full shrink-0 overflow-hidden pt-1.5 text-center text-[9px] font-extrabold uppercase leading-tight tracking-wide line-clamp-2 sm:pt-2 sm:text-[11px]"
            style={{
              color: "#ffffff",
              textShadow: nameShadow,
              wordBreak: "break-word",
            }}
          >
            {nameLine}
          </span>
        )}
        <div className={`flex w-full flex-1 items-center justify-center ${mini ? "pb-0" : "pb-1"}`}>
          <span
            className="font-black tabular-nums leading-none tracking-tight"
            style={{
              fontSize: mini ? (label.length >= 2 ? "0.55rem" : "0.62rem") : label.length >= 2 ? "1.95rem" : "2.2rem",
              color: "#ffffff",
              textShadow: "0 0 5px #000, 0 3px 8px #000, 0 -1px 4px #000",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

function KitShirtPlaceholder() {
  return (
    <div className="relative mx-2 mt-0.5 flex aspect-[4/5] max-h-[6rem] items-center justify-center overflow-hidden rounded-t-[14px] border border-dashed border-white/25 bg-gradient-to-b from-slate-800/80 to-slate-950/90">
      <span className="text-2xl font-black text-white/25">?</span>
    </div>
  )
}

function PointsBadge({
  points,
  filled,
  caption,
  subdued,
}: {
  points: number
  filled: boolean
  caption?: string
  subdued?: boolean
}) {
  if (!filled) {
    return (
      <div className="min-h-[1.75rem] min-w-[4.5rem] rounded-full border border-white/10 bg-white/5" aria-hidden />
    )
  }
  const positive = points > 0
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums shadow-lg border backdrop-blur-sm ${
          subdued
            ? "bg-white/10 text-white/50 border-white/15"
            : positive
              ? "bg-emerald-500/25 text-emerald-100 border-emerald-400/45"
              : "bg-white/92 text-slate-800 border-white/60"
        }`}
      >
        {positive ? "+" : ""}
        {points}
        <span className="font-semibold opacity-75 ml-0.5">pts</span>
      </div>
      {caption && <span className="text-[9px] uppercase tracking-wide text-white/35">{caption}</span>}
    </div>
  )
}

function FantasyPlayerCard({
  slot,
  badge,
  player,
  shirtNumber,
  teamGamesPlayed,
  locked,
  status,
  isPickerOpen,
  isCaptain,
  variant = "active",
  onChoose,
}: {
  slot: SlotKey
  badge: string
  player: Player | null
  shirtNumber: number
  /** Finished WC matches this nation has played (all squad members share). */
  teamGamesPlayed: number
  locked: boolean
  status: "empty" | "editing" | "filled" | "locked"
  isPickerOpen: boolean
  isCaptain?: boolean
  variant?: "active" | "substituted-out" | "supersub-in"
  onChoose: () => void
}) {
  const isSubbedOut = variant === "substituted-out"
  const isSubIn = variant === "supersub-in"
  const posLabel = POSITION_LABELS[SLOT_POSITION[slot]]
  const isGk = slot === "gk"
  const lightKit = isGk && !!player

  const shell = lightKit
    ? "border-zinc-300/80 bg-gradient-to-b from-zinc-100 via-white to-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
    : "border-cyan-400/22 bg-gradient-to-b from-[#28344e]/95 via-[#1c263c]/96 to-[#0e1628] shadow-[inset_0_1px_0_rgba(255,255,255,0.11)]"

  const hexBg =
    "pointer-events-none absolute inset-0 opacity-[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.08)_50%,rgba(255,255,255,.08)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"

  const showCleanSheet = player ? player.position === "gk" || player.position === "df" : false
  const statMuted = lightKit ? "text-zinc-400" : "text-slate-400/85"
  const statVal = "tabular-nums text-[9px] sm:text-[10px]"

  return (
    <div
      className={`relative w-[9.25rem] sm:w-40 ${isSubbedOut ? "scale-[0.88] opacity-[0.55] grayscale-[0.35]" : ""} ${isSubIn ? "ring-1 ring-cyan-400/35 rounded-2xl" : ""}`}
    >
      {isSubbedOut && (
        <div className="absolute -top-2 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-slate-900/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-300">
          OUT
        </div>
      )}
      {isSubIn && (
        <div className="absolute -top-2 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/40 bg-cyan-950/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-cyan-200">
          From R32
        </div>
      )}
      {isPickerOpen && (
        <div className="pointer-events-none absolute -inset-1 z-20" aria-hidden>
          <span className="absolute top-0 left-0 h-3 w-3 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-sm" />
          <span className="absolute top-0 right-0 h-3 w-3 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-sm" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-l-2 border-b-2 border-cyan-400/70 rounded-bl-sm" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-r-2 border-b-2 border-cyan-400/70 rounded-br-sm" />
        </div>
      )}
      <button
        type="button"
        disabled={locked}
        onClick={locked ? undefined : onChoose}
        aria-label={player ? `${player.name}, ${badge}` : `Pick ${posLabel}`}
        className={`relative w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 ${shell} ${
          isSubbedOut
            ? "cursor-default border-white/10"
            : locked
              ? "cursor-default opacity-95"
              : "cursor-pointer hover:border-wc-gold/80 hover:scale-[1.02] active:scale-[0.99]"
        } ${status === "empty" ? "border-dashed opacity-90" : ""}`}
      >
        <div className={hexBg} />

        {/* Top meta row */}
        <div
          className={`relative flex items-center justify-between gap-1 px-2 pt-1.5 pb-1 text-[8px] font-bold uppercase tracking-wider ${
            lightKit ? "text-zinc-500" : "text-slate-400/90"
          }`}
        >
          <span>WC26</span>
          <span className="flex items-center gap-1">
            {isCaptain && (
              <span className="rounded bg-amber-500/90 px-1 py-0.5 text-[7px] font-black text-black">C</span>
            )}
            <span className="rounded bg-black/25 px-1 py-0.5 text-[7px] text-white/90">{badge}</span>
          </span>
        </div>

        {player ? (
          <>
            <KitShirtBack kit={getKitForTeam(player.team)} number={shirtNumber} name={player.name} team={player.team} />

            {/* Stats — row1: G A [CS] MVP (CS only GK/DF; MF/FW = 3 cols) · row2: GP W POS NAT */}
            <div
              className={`relative border-t px-0.5 py-1.5 text-center text-[7px] font-semibold uppercase leading-tight tracking-wide sm:text-[8px] mt-2 ${lightKit ? "border-zinc-300/80 text-zinc-600" : "border-white/12 text-slate-200/90"}`}
            >
              <div className="space-y-1">
                <div className={`grid gap-x-0.5 ${showCleanSheet ? "grid-cols-4" : "grid-cols-3"}`}>
                  <div className="min-w-0">
                    <div className={statMuted}>G</div>
                    <div className={statVal}>{player.goals}</div>
                  </div>
                  <div className="min-w-0">
                    <div className={statMuted}>A</div>
                    <div className={statVal}>{player.assists}</div>
                  </div>
                  {showCleanSheet && (
                    <div className="min-w-0">
                      <div className={statMuted}>CS</div>
                      <div className={statVal}>{player.clean_sheets}</div>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={statMuted}>MVP</div>
                    <div className={statVal}>{player.mvp}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-0.5">
                  <div className="min-w-0" title="Team matches finished (World Cup)">
                    <div className={statMuted}>GP</div>
                    <div className={statVal}>{teamGamesPlayed}</div>
                  </div>
                  <div className="min-w-0">
                    <div className={statMuted}>W</div>
                    <div className={statVal}>{player.wins}</div>
                  </div>
                  <div className="min-w-0">
                    <div className={statMuted}>Pos</div>
                    <div className="text-[9px] sm:text-[10px] leading-none">{badge}</div>
                  </div>
                  <div className="flex min-w-0 flex-col items-center justify-start">
                    <div className={statMuted}>Nat</div>
                    <FlagImage
                      src={getFlagSrc(player.team)}
                      alt=""
                      className="mt-0.5 h-3.5 w-5 rounded-sm object-cover ring-1 ring-black/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex flex-col items-center px-2 pb-4 pt-2 text-center">
            <KitShirtPlaceholder />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-300/90">{posLabel}</span>
            <span className="mt-1 text-[9px] text-white/50">Tap to pick</span>
          </div>
        )}
      </button>
    </div>
  )
}
