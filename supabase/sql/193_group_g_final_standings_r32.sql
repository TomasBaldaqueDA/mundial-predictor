-- Group G final standings (after matches 14, 16, 38, 40, 65, 66)
-- 1 Belgium 5pts (+4 GD) | 2 Egypt 5pts (+2 GD) | 3 IR Iran 3pts | 4 New Zealand 1pt
-- Advance 1G and 2G to Round of 32 (match 81 team1, match 86 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('G', 1, 'Belgium'),
  ('G', 2, 'Egypt'),
  ('G', 3, 'IR Iran'),
  ('G', 4, 'New Zealand')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Belgium'
WHERE id = 81 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Egypt'
WHERE id = 86 AND stage = 'Round of 32';
