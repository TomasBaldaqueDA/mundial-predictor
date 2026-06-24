-- Group B final standings (after matches 3, 5, 26, 27, 49, 50)
-- 1 Switzerland 7pts | 2 Canada 4pts (+5 GD) | 3 Bosnia and Herzegovina 4pts | 4 Qatar 1pt
-- Advance 1B and 2B to Round of 32 (match 73 team2, match 85 team1)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('B', 1, 'Switzerland'),
  ('B', 2, 'Canada'),
  ('B', 3, 'Bosnia and Herzegovina'),
  ('B', 4, 'Qatar')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team2 = 'Canada'
WHERE id = 73 AND stage = 'Round of 32';

UPDATE public.matches SET team1 = 'Switzerland'
WHERE id = 85 AND stage = 'Round of 32';
