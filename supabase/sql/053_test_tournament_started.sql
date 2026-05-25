-- QA: mark the opening World Cup match as started (kickoff in the past + finished).
-- Unlocks "View answers" on /questions/answers and 5-A-SIDE tournament lock for testing.
-- Revert with 051_reset_test_data.sql or set kickoff back to schedule.

UPDATE public.matches
SET
  kickoff_time = (now() AT TIME ZONE 'utc') - interval '3 hours',
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp = 'Test MVP'
WHERE id = (
  SELECT id FROM public.matches ORDER BY kickoff_time ASC LIMIT 1
);

SELECT public.refresh_five_a_side_player_stats();
