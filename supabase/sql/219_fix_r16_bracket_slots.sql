-- Fix Round of 16 bracket slots (matches 89–94).
-- Root cause: internal R32 match IDs 74–78 ≠ FIFA match numbers, so W74/W75/W76/W77/W78
-- were written to the wrong R16 fixtures.
-- Kickoff times: see 220_r16_kickoffs_pt.sql

UPDATE public.matches SET team1 = 'Paraguay', team2 = 'France'
WHERE id = 89 AND stage = 'Round of 16';

UPDATE public.matches SET team1 = 'Canada', team2 = 'Morocco'
WHERE id = 90 AND stage = 'Round of 16';

UPDATE public.matches SET team1 = 'Brazil', team2 = 'Norway'
WHERE id = 91 AND stage = 'Round of 16';

UPDATE public.matches SET team1 = 'W83', team2 = 'W84'
WHERE id = 93 AND stage = 'Round of 16';

UPDATE public.matches SET team1 = 'USA', team2 = 'Belgium'
WHERE id = 94 AND stage = 'Round of 16';
