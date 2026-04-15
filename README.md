This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Live scores (real API)

This project supports real-time score sync into `public.matches` through:

- `POST /api/cron/live-scores` (fetches provider data and updates `score1/score2/status/mvp`)
- `POST /api/cron/advance-matches` (forces status transitions `scheduled -> started -> finished`)

### Required environment variables

Use `.env.example` as template and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Then configure one provider:

- **API-Football**: set `FOOTBALL_API_KEY` (optional `FOOTBALL_API_BASE_URL`)
- **Custom feed**: set `LIVE_SCORES_API_URL` (optional `LIVE_SCORES_API_KEY`)

For World Cup scope with API-Football (recommended):

- `FOOTBALL_API_LEAGUE_ID=1`
- `FOOTBALL_API_SEASON=2026`
- `FOOTBALL_API_LIVE_STATUS=1H-HT-2H-ET-P-BT-LIVE`

### Scheduler (every minute)

`vercel.json` is already configured with minute cron jobs:

- `/api/cron/live-scores`
- `/api/cron/advance-matches`

After deployment on Vercel:

1. Add env vars in Project Settings.
2. Redeploy.
3. Verify in Vercel Logs that cron calls are running every minute.

### Smart request budgeting (free plan friendly)

Even with per-minute cron, the API route can skip external provider calls unless
the current UTC time matches your configured polling window/interval.

Use these env vars:

- `LIVE_SCORES_POLL_MINUTES` (default `30`)
- `LIVE_SCORES_ACTIVE_START_HOUR_UTC` (default `10`)
- `LIVE_SCORES_ACTIVE_END_HOUR_UTC` (default `24`)
- `LIVE_SCORES_ACTIVE_DAYS_UTC` (default `0,1,2,3,4,5,6`)

For API-Football free tier (100 req/day), a safe baseline is:

- `LIVE_SCORES_POLL_MINUTES=30`
- active window around your match hours only (example `10` to `24` UTC)

With this setup, requests are scoped to `league=1` and `season=2026` only.

You can manually bypass the schedule for testing:

```bash
curl -X POST "http://localhost:3000/api/cron/live-scores?secret=YOUR_CRON_SECRET&force=1"
```

### Local manual trigger

Call endpoints with `CRON_SECRET`:

```bash
curl -X POST "http://localhost:3000/api/cron/live-scores?secret=YOUR_CRON_SECRET"
curl -X POST "http://localhost:3000/api/cron/advance-matches?secret=YOUR_CRON_SECRET"
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
