-- Group K final standings (after matches 21, 24, 45, 48, 69, 70)
-- 1 Colombia 7pts | 2 Portugal 5pts | 3 Congo DR 4pts | 4 Uzbekistan 0pts
-- Advance 1K and 2K to Round of 32 (match 88 team1, match 84 team1)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('K', 1, 'Colombia'),
  ('K', 2, 'Portugal'),
  ('K', 3, 'Congo DR'),
  ('K', 4, 'Uzbekistan')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Colombia'
WHERE id = 88 AND stage = 'Round of 32';

UPDATE public.matches SET team1 = 'Portugal'
WHERE id = 84 AND stage = 'Round of 32';
