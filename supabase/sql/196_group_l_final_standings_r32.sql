-- Group L final standings (after matches 22, 23, 46, 47, 67, 68)
-- 1 England 7pts | 2 Croatia 6pts | 3 Ghana 4pts | 4 Panama 0pts
-- Advance 1L and 2L to Round of 32 (match 80 team1, match 84 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('L', 1, 'England'),
  ('L', 2, 'Croatia'),
  ('L', 3, 'Ghana'),
  ('L', 4, 'Panama')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'England'
WHERE id = 80 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Croatia'
WHERE id = 84 AND stage = 'Round of 32';
