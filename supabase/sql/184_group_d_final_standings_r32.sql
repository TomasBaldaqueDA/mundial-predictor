-- Group D final standings (after matches 4, 8, 29, 32, 59, 60)
-- 1 USA 6pts | 2 Australia 4pts | 3 Paraguay 4pts | 4 Türkiye 3pts
-- Advance 1D and 2D to Round of 32 (match 82 team1, match 86 team1)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('D', 1, 'USA'),
  ('D', 2, 'Australia'),
  ('D', 3, 'Paraguay'),
  ('D', 4, 'Türkiye')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'USA'
WHERE id = 82 AND stage = 'Round of 32';

UPDATE public.matches SET team1 = 'Australia'
WHERE id = 86 AND stage = 'Round of 32';
