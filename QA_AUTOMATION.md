# QA Automation Quickstart

This script prepares realistic QA data so you can test all core flows quickly.

## 1) Run automated audit (production smoke + 3 users)

```bash
npm run qa:audit
```

Checks public pages (200), core table counts, login for all QA users, cross-user RLS, and league seed.

## 2) Run seed

```bash
npm run qa:seed
```

It will:

- create or reuse 3 test users
- upsert profiles
- create predictions for upcoming matches
- create answers in special questions
- create one group prediction set
- create 5-a-side picks
- create one private league and auto-add members

## 3) Test accounts

- `wc26.qa.01@example.com` / `Wc26Qa!123`
- `wc26.qa.02@example.com` / `Wc26Qa!123`
- `wc26.qa.03@example.com` / `Wc26Qa!123`

## 4) Suggested E2E run

1. Login with user 01 and check `Games`, `Predict`, `Questions`, `Groups`, `5-A-SIDE`.
2. Login with user 02 and join/check league rankings.
3. Login with user 03 and verify cross-user views (league/group/ranking).
4. Trigger cron endpoints and confirm `Games` live data rendering.

Use `QA_CHECKLIST.md` as pass/fail checklist.
