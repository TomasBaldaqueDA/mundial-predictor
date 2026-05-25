# QA Checklist (Web)

Use this before major deploys to keep the app portfolio-ready.

## 0) Database migrations (required before launch)

Apply in Supabase SQL Editor, in order:

1. `supabase/sql/049_fix_recalc_trigger_and_guard.sql`
2. `supabase/sql/050_qualifier_point.sql`
3. `supabase/sql/052_ranking_match_points_rpc.sql`

Verify: `npm run verify:migrations` (expect calc_prediction_points = 6 and get_match_points_by_user exists).

## 1) Access and auth

- Register a new user and confirm login works.
- Logout/login cycle keeps the correct profile.
- Protected pages redirect to login when signed out.

## 2) Games and predictions

- `Games` page loads upcoming + past matches.
- Live match card shows `Live` badge + red pulse dot.
- Live score appears and updates after cron sync.
- Existing prediction remains visible when match is live.
- `Predict` page blocks negative or invalid score values.
- Knockout draw requires selecting qualifying team.

## 3) Leagues and groups

- Create league with valid name and share code.
- Join league with valid code and verify leaderboard updates.
- Group predictions require all positions before save.
- Error states are readable on mobile widths.

## 4) 5-A-SIDE

- Can pick exactly 1 GK, 1 DF, 2 MD, 1 ST.
- One player per nation is enforced in UI.
- Duplicate nation save is rejected by DB trigger.
- Team locks after submit / first kickoff as expected.

## 5) Questions

- Number-type answers only accept whole numbers >= 0.
- Winner/team question labels remain readable.
- Submit and edit flow works before lock time.

## 6) Cron and data freshness

- Vercel crons: `live-scores` every 15 min (10:00–23:59 UTC), `advance-matches` at :05/:20/:35/:50 in same window.
- `live-scores` with `Authorization: Bearer $CRON_SECRET` returns `matched`, `unmatched`, `updated`, `update_failed`, `unmatched_examples`.
- `advance-matches` endpoint returns `ok: true`.
- Logs include cron run duration; warnings when `unmatched > 0` or `update_failed > 0`.
- If unmatched > 0, inspect `unmatched_examples` and add `FOOTBALL_TEAM_ALIASES` entries.

## 7) Final sanity

- Run tests: `npm test`
- Run production build: `npm run build`
- Open key pages on mobile viewport (Games, Predict, 5-A-SIDE).
