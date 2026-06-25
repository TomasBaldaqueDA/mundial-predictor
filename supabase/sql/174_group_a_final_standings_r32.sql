-- Group A final standings (after matches 1, 2, 25, 28, 53, 54)
-- 1 Mexico 9pts | 2 South Africa 4pts | 3 Korea Republic 3pts | 4 Czechia 1pt
-- Advance 1A and 2A to Round of 32 (match 79 team1, match 73 team1)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('A', 1, 'Mexico'),
  ('A', 2, 'South Africa'),
  ('A', 3, 'Korea Republic'),
  ('A', 4, 'Czechia')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Mexico'
WHERE id = 79 AND stage = 'Round of 32';

UPDATE public.matches SET team1 = 'South Africa'
WHERE id = 73 AND stage = 'Round of 32';
