-- Group H final standings (after matches 13, 15, 37, 39, 63, 64)
-- 1 Spain 7pts | 2 Cabo Verde 3pts | 3 Uruguay 2pts | 4 Saudi Arabia 2pts
-- Advance 1H and 2H to Round of 32 (match 83 team1, match 87 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('H', 1, 'Spain'),
  ('H', 2, 'Cabo Verde'),
  ('H', 3, 'Uruguay'),
  ('H', 4, 'Saudi Arabia')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Spain'
WHERE id = 83 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Cabo Verde'
WHERE id = 87 AND stage = 'Round of 32';
