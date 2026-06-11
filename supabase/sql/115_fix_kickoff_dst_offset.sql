-- 115: Fix a 1-hour DST offset on every match kickoff.
-- All 104 kickoffs were stored 1h late (European summer time, UTC+2, was saved
-- as if it were UTC+1). Verified against FIFA/official ET schedule: e.g. the
-- opener Mexico vs South Africa is 19:00 UTC (16:00 Brasilia / 13:00 CDMX),
-- not 20:00 UTC. Kickoff drives prediction lock time, so this also corrects
-- when predictions close.
--
-- One-time data correction (run exactly once).

UPDATE public.matches SET kickoff_time = kickoff_time - interval '1 hour';
