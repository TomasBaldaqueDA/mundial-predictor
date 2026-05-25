-- Production launch cleanup: revert QA match overrides, remove orphan/test rows.
-- Safe to re-run.

-- 1) Opening match (Mexico vs South Africa) — undo 053_test_tournament_started / manual tests
UPDATE public.matches
SET
  kickoff_time = '2026-06-11 20:00:00+00',
  status       = 'scheduled',
  score1       = NULL,
  score2       = NULL,
  mvp          = NULL,
  qualifier    = NULL
WHERE id = 1;

UPDATE public.predictions
SET points = 0
WHERE match_id = 1;

-- 2) Orphan predictions (legacy rows without user_id)
DELETE FROM public.predictions
WHERE user_id IS NULL;

-- 3) Test private leagues
DELETE FROM public.private_leagues
WHERE lower(trim(name)) IN ('teste', 'test');

-- 4) QA / obvious test auth users (cascades profiles, predictions, league members)
DO $$
DECLARE
  test_user_ids uuid[];
BEGIN
  SELECT array_agg(id) INTO test_user_ids
  FROM auth.users
  WHERE email ILIKE 'qa%@%'
     OR email ILIKE '%@example.com'
     OR email ILIKE 'wc26.qa.%'
     OR raw_user_meta_data->>'display_name' ILIKE 'QA User%';

  IF test_user_ids IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);
  END IF;
END;
$$;

-- 5) Dev duplicate accounts (keep owner tomasbaldaque10@outlook.pt)
DO $$
DECLARE
  dev_ids uuid[];
BEGIN
  SELECT array_agg(id) INTO dev_ids
  FROM auth.users
  WHERE email IN (
    'tomas.marinho3@gmail.com',
    'tomas.marinho3@outlook.com',
    'josemourinho2021fm@gmail.com'
  );

  IF dev_ids IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = ANY(dev_ids);
  END IF;
END;
$$;

-- 6) Refresh 5-A-SIDE stats after match reset
SELECT public.refresh_five_a_side_player_stats();
