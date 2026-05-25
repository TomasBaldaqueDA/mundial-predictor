# QA Checklist (Web)

Use this before major deploys to keep the app portfolio-ready.

## 0) Database migrations (required before launch)

Apply in Supabase SQL Editor, in order:

1. `supabase/sql/049_fix_recalc_trigger_and_guard.sql`
2. `supabase/sql/050_qualifier_point.sql`
3. `supabase/sql/052_ranking_match_points_rpc.sql`
4. `supabase/sql/055_launch_cleanup.sql` (run once before launch if QA data was applied)

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

**Free-tier default (Vercel + API-Football):** one automatic sync per day.

- Vercel crons: `live-scores` at **12:00 UTC**, `advance-matches` at **12:10 UTC** (1 API call/day from cron).
- Manual sync when needed (uses 1 API call each time):
  `curl -X POST "https://YOUR_APP/api/cron/live-scores?force=1" -H "Authorization: Bearer $CRON_SECRET"`
- Or update scores/MVP/qualifier directly in Supabase — points recalc via DB trigger.
- `live-scores` response should include `matched`, `unmatched`, `updated`, `update_failed`, `unmatched_examples`.
- `advance-matches` returns `ok: true`.
- If `unmatched > 0`, inspect `unmatched_examples` and add `FOOTBALL_TEAM_ALIASES` entries.

## 7) Final sanity

- Run tests: `npm test`
- Run production build: `npm run build`
- Open key pages on mobile viewport (Games, Predict, 5-A-SIDE).
