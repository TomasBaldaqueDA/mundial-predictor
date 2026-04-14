import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

type LiveFixture = {
  homeTeam: string
  awayTeam: string
  kickoffTime?: string | null
  scoreHome?: number | null
  scoreAway?: number | null
  status?: "scheduled" | "started" | "finished" | null
  mvp?: string | null
}

type MatchRow = {
  id: number
  team1: string
  team2: string
  kickoff_time: string
  status: string | null
  score1: number | null
  score2: number | null
  mvp: string | null
}

function normalizeTeam(value: string): string {
  const raw = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
  const aliases: Record<string, string> = {
    atlmadrid: "atleticomadrid",
    atleticodemadrid: "atleticomadrid",
    parisstgermain: "psg",
    psg: "psg",
    manunited: "manchesterunited",
    manutd: "manchesterunited",
    intermiami: "intermiami",
  }
  return aliases[raw] ?? raw
}

function toInt(value: unknown): number | null {
  if (value == null || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

function mapStatus(raw: string | null | undefined): "scheduled" | "started" | "finished" | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  if (!s) return null
  if (["scheduled", "ns", "tbd", "notstarted", "pending"].includes(s)) return "scheduled"
  if (["started", "live", "inplay", "1h", "2h", "ht", "et", "bt", "int"].includes(s)) return "started"
  if (["finished", "ft", "aet", "pen", "afterpenalties", "fulltime", "completed"].includes(s)) return "finished"
  return null
}

function extractCustomFixtures(payload: unknown): LiveFixture[] {
  const root = payload as Record<string, unknown>
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(root?.matches)
      ? root.matches
      : Array.isArray(root?.fixtures)
        ? root.fixtures
        : []

  const out: LiveFixture[] = []
  for (const row of rows) {
    const r = row as Record<string, unknown>
    const homeTeam = String(r.homeTeam ?? r.home ?? r.team1 ?? "")
    const awayTeam = String(r.awayTeam ?? r.away ?? r.team2 ?? "")
    if (!homeTeam || !awayTeam) continue
    out.push({
      homeTeam,
      awayTeam,
      kickoffTime: (r.kickoffTime ?? r.kickoff_time ?? r.date ?? null) as string | null,
      scoreHome: toInt(r.scoreHome ?? r.homeScore ?? r.score1 ?? r.goalsHome ?? null),
      scoreAway: toInt(r.scoreAway ?? r.awayScore ?? r.score2 ?? r.goalsAway ?? null),
      status: mapStatus((r.status ?? r.state ?? null) as string | null | undefined),
      mvp: (r.mvp ?? null) as string | null,
    })
  }
  return out
}

async function fetchFromCustomFeed(url: string): Promise<LiveFixture[]> {
  const apiKey = process.env.LIVE_SCORES_API_KEY
  const headers: Record<string, string> = {}
  if (apiKey) headers.authorization = `Bearer ${apiKey}`

  const res = await fetch(url, { method: "GET", headers, cache: "no-store" })
  if (!res.ok) throw new Error(`Custom live-scores feed failed (${res.status})`)
  const payload = await res.json()
  return extractCustomFixtures(payload)
}

async function fetchFromApiFootball(): Promise<LiveFixture[]> {
  const key = process.env.FOOTBALL_API_KEY
  if (!key) return []
  const base = (process.env.FOOTBALL_API_BASE_URL ?? "https://v3.football.api-sports.io").replace(/\/$/, "")
  const today = new Date().toISOString().slice(0, 10)

  const [liveRes, todayRes] = await Promise.all([
    fetch(`${base}/fixtures?live=all`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    }),
    fetch(`${base}/fixtures?date=${today}`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    }),
  ])

  const rows: unknown[] = []
  if (liveRes.ok) {
    const body = (await liveRes.json()) as { response?: unknown[] }
    if (Array.isArray(body.response)) rows.push(...body.response)
  }
  if (todayRes.ok) {
    const body = (await todayRes.json()) as { response?: unknown[] }
    if (Array.isArray(body.response)) rows.push(...body.response)
  }

  const dedupe = new Map<string, LiveFixture>()
  for (const row of rows) {
    const r = row as Record<string, unknown>
    const teams = r.teams as Record<string, unknown> | undefined
    const fixture = r.fixture as Record<string, unknown> | undefined
    const goals = r.goals as Record<string, unknown> | undefined
    const homeName = String((teams?.home as Record<string, unknown> | undefined)?.name ?? "")
    const awayName = String((teams?.away as Record<string, unknown> | undefined)?.name ?? "")
    if (!homeName || !awayName) continue
    const statusShort = String((fixture?.status as Record<string, unknown> | undefined)?.short ?? "")
    const id = String(fixture?.id ?? `${homeName}-${awayName}-${fixture?.date ?? ""}`)
    dedupe.set(id, {
      homeTeam: homeName,
      awayTeam: awayName,
      kickoffTime: (fixture?.date ?? null) as string | null,
      scoreHome: toInt(goals?.home ?? null),
      scoreAway: toInt(goals?.away ?? null),
      status: mapStatus(statusShort),
      mvp: null,
    })
  }
  return [...dedupe.values()]
}

function pickBestMatch(feed: LiveFixture, matches: MatchRow[]): MatchRow | null {
  const h = normalizeTeam(feed.homeTeam)
  const a = normalizeTeam(feed.awayTeam)
  const feedKickoff = feed.kickoffTime ? new Date(feed.kickoffTime).getTime() : null
  let best: { row: MatchRow; diff: number } | null = null

  for (const m of matches) {
    const m1 = normalizeTeam(m.team1)
    const m2 = normalizeTeam(m.team2)
    const sameOrder = m1 === h && m2 === a
    const flipped = m1 === a && m2 === h
    if (!sameOrder && !flipped) continue
    const diff = feedKickoff == null ? 0 : Math.abs(new Date(m.kickoff_time).getTime() - feedKickoff)
    if (!best || diff < best.diff) best = { row: m, diff }
  }
  return best?.row ?? null
}

/**
 * POST /api/cron/live-scores
 * - Requires Authorization: Bearer CRON_SECRET (or ?secret=)
 * - Source priority: LIVE_SCORES_API_URL (custom feed) -> API-Football (FOOTBALL_API_KEY)
 * - Maps fixtures by team names (+ nearest kickoff) and updates matches score/status/mvp.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  const q = request.nextUrl.searchParams.get("secret")
  const ok = secret && (auth === `Bearer ${secret}` || q === secret)
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = supabaseAdmin
  if (!db) return NextResponse.json({ error: "Server misconfigured" }, { status: 503 })

  let fixtures: LiveFixture[] = []
  const customUrl = process.env.LIVE_SCORES_API_URL
  try {
    if (customUrl) {
      fixtures = await fetchFromCustomFeed(customUrl)
    } else if (process.env.FOOTBALL_API_KEY) {
      fixtures = await fetchFromApiFootball()
    } else {
      return NextResponse.json({
        ok: false,
        message: "Configure LIVE_SCORES_API_URL or FOOTBALL_API_KEY.",
      })
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Live-scores fetch failed" },
      { status: 502 }
    )
  }

  const from = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  const to = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  const { data: rows, error: readErr } = await db
    .from("matches")
    .select("id, team1, team2, kickoff_time, status, score1, score2, mvp")
    .gte("kickoff_time", from)
    .lte("kickoff_time", to)
  if (readErr) return NextResponse.json({ ok: false, error: readErr.message }, { status: 500 })

  const candidates = (rows ?? []) as MatchRow[]
  let updated = 0
  let matched = 0
  let unmatched = 0

  for (const f of fixtures) {
    const match = pickBestMatch(f, candidates)
    if (!match) {
      unmatched++
      continue
    }
    matched++
    const sameOrder =
      normalizeTeam(match.team1) === normalizeTeam(f.homeTeam) &&
      normalizeTeam(match.team2) === normalizeTeam(f.awayTeam)
    const score1 = sameOrder ? f.scoreHome ?? null : f.scoreAway ?? null
    const score2 = sameOrder ? f.scoreAway ?? null : f.scoreHome ?? null
    const nextStatus = f.status ?? null

    const patch: Record<string, unknown> = {}
    if (score1 != null && score2 != null) {
      if (match.score1 !== score1) patch.score1 = score1
      if (match.score2 !== score2) patch.score2 = score2
    }
    if (nextStatus && nextStatus !== match.status) patch.status = nextStatus
    if (f.mvp && f.mvp !== match.mvp) patch.mvp = f.mvp

    if (Object.keys(patch).length === 0) continue
    const { error } = await db.from("matches").update(patch).eq("id", match.id)
    if (!error) updated++
  }

  const { data: advanceResult, error: advanceErr } = await db.rpc("advance_match_statuses")

  return NextResponse.json({
    ok: true,
    source: customUrl ? "custom" : "api-football",
    fixtures_received: fixtures.length,
    matched,
    unmatched,
    updated,
    advanced: advanceErr ? { error: advanceErr.message } : advanceResult,
  })
}
