-- Group E final standings (after matches 9, 11, 34, 35, 55, 56)
-- 1 Germany 6pts (+6 GD) | 2 Côte d'Ivoire 6pts (+2 GD) | 3 Ecuador 4pts | 4 Curaçao 1pt
-- Advance 1E and 2E to Round of 32 (match 75 team1, match 77 team1)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('E', 1, 'Germany'),
  ('E', 2, 'Côte d''Ivoire'),
  ('E', 3, 'Ecuador'),
  ('E', 4, 'Curaçao')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Germany'
WHERE id = 75 AND stage = 'Round of 32';

UPDATE public.matches SET team1 = 'Côte d''Ivoire'
WHERE id = 77 AND stage = 'Round of 32';
