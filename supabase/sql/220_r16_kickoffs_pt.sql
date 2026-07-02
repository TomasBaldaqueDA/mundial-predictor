-- Round of 16 kickoffs stored as UTC instants (PT display = stored + 1h in WEST).
-- Matches 89–96; see 221 if 220 was already applied with wall-clock PT values.

UPDATE public.matches SET kickoff_time = '2026-07-04 21:00:00', team1 = 'Paraguay', team2 = 'France'
WHERE id = 89 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-04 17:00:00', team1 = 'Canada', team2 = 'Morocco'
WHERE id = 90 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-05 20:00:00', team1 = 'Brazil', team2 = 'Norway'
WHERE id = 91 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-06 00:00:00', team1 = 'Mexico', team2 = 'England'
WHERE id = 92 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-06 19:00:00', team1 = 'W83', team2 = 'W84'
WHERE id = 93 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-07 00:00:00', team1 = 'USA', team2 = 'Belgium'
WHERE id = 94 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-07 16:00:00', team1 = 'W86', team2 = 'W88'
WHERE id = 95 AND stage = 'Round of 16';

UPDATE public.matches SET kickoff_time = '2026-07-07 20:00:00', team1 = 'W85', team2 = 'W87'
WHERE id = 96 AND stage = 'Round of 16';
