-- Group J final standings (after matches 19, 20, 41, 44, 71, 72)
-- 1 Argentina 9pts | 2 Algeria 6pts | 3 Austria 3pts | 4 Jordan 0pts
-- Advance 1J and 2J to Round of 32 (match 87 team1, match 83 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('J', 1, 'Argentina'),
  ('J', 2, 'Algeria'),
  ('J', 3, 'Austria'),
  ('J', 4, 'Jordan')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Argentina'
WHERE id = 87 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Algeria'
WHERE id = 83 AND stage = 'Round of 32';
