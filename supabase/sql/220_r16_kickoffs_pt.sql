-- Round of 16 kickoffs (Portuguese local times) and team order for M94 (USA vs Belgium).
-- Matches 89–96 per official FIFA schedule, times as shown to PT users.

UPDATE public.matches
SET kickoff_time = '2026-07-04 22:00:00', team1 = 'Paraguay', team2 = 'France'
WHERE id = 89 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-04 18:00:00', team1 = 'Canada', team2 = 'Morocco'
WHERE id = 90 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-05 21:00:00', team1 = 'Brazil', team2 = 'Norway'
WHERE id = 91 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-06 01:00:00', team1 = 'Mexico', team2 = 'England'
WHERE id = 92 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-06 20:00:00', team1 = 'W83', team2 = 'W84'
WHERE id = 93 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-07 01:00:00', team1 = 'USA', team2 = 'Belgium'
WHERE id = 94 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-07 17:00:00', team1 = 'W86', team2 = 'W88'
WHERE id = 95 AND stage = 'Round of 16';

UPDATE public.matches
SET kickoff_time = '2026-07-07 21:00:00', team1 = 'W85', team2 = 'W87'
WHERE id = 96 AND stage = 'Round of 16';
