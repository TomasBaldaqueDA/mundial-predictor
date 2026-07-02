-- Correct R16 kickoffs after 220 stored PT wall-clock times (site showed +1h in Portugal).
-- Kickoffs are stored as UTC; browser adds WEST (+1) for PT users.

UPDATE public.matches SET kickoff_time = kickoff_time - interval '1 hour'
WHERE id BETWEEN 89 AND 96 AND stage = 'Round of 16';
