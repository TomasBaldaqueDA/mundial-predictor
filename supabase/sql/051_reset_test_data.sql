-- 1. Reset match 1 (Mexico vs South Africa) back to scheduled state
UPDATE public.matches
SET
  kickoff_time = '2026-06-11 20:00:00+00',
  status       = 'scheduled',
  score1       = NULL,
  score2       = NULL,
  mvp          = NULL,
  qualifier    = NULL
WHERE id = 1;

-- Also clear points from predictions for this match (no result anymore)
UPDATE public.predictions
SET points = 0
WHERE match_id = 1;

-- 2. Delete all private leagues named 'teste' (case-insensitive)
DELETE FROM public.private_leagues
WHERE lower(trim(name)) = 'teste';

-- 3. Delete QA test users (profiles + auth users via cascade)
-- First grab their UUIDs
DO $$
DECLARE
  test_user_ids uuid[];
BEGIN
  SELECT array_agg(id) INTO test_user_ids
  FROM auth.users
  WHERE email ILIKE 'qa%@%'
     OR email ILIKE '%test%@%'
     OR raw_user_meta_data->>'display_name' ILIKE 'QA User%';

  IF test_user_ids IS NOT NULL THEN
    -- Remove from auth (cascades to profiles and predictions via FK)
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);
  END IF;
END;
$$;
