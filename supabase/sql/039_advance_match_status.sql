-- Advance match lifecycle: scheduled → started (after kickoff); → finished when scores set.
-- Schedule: Supabase pg_cron, or Vercel Cron → POST /api/cron/advance-matches with CRON_SECRET.

CREATE OR REPLACE FUNCTION public.advance_match_statuses()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n_started int;
  n_finished int;
BEGIN
  UPDATE public.matches
  SET status = 'started'
  WHERE status = 'scheduled'
    AND kickoff_time IS NOT NULL
    AND kickoff_time <= now();
  GET DIAGNOSTICS n_started = ROW_COUNT;

  UPDATE public.matches
  SET status = 'finished'
  WHERE status IN ('scheduled', 'started')
    AND score1 IS NOT NULL
    AND score2 IS NOT NULL;
  GET DIAGNOSTICS n_finished = ROW_COUNT;

  RETURN json_build_object('updated_started', n_started, 'updated_finished', n_finished);
END;
$$;

GRANT EXECUTE ON FUNCTION public.advance_match_statuses() TO service_role;
