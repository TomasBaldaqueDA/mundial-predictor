-- Group C final standings (after matches 6, 7, 30, 31, 51, 52)
-- 1 Brazil 7pts (+6 GD) | 2 Morocco 7pts (+3 GD) | 3 Scotland 3pts | 4 Haiti 0pts
-- Advance 1C and 2C to Round of 32 (match 74 team1, match 76 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('C', 1, 'Brazil'),
  ('C', 2, 'Morocco'),
  ('C', 3, 'Scotland'),
  ('C', 4, 'Haiti')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Brazil'
WHERE id = 74 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Morocco'
WHERE id = 76 AND stage = 'Round of 32';
