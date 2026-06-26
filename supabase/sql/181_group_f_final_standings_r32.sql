-- Group F final standings (after matches 10, 12, 33, 36, 57, 58)
-- 1 Netherlands 7pts | 2 Japan 5pts | 3 Sweden 4pts | 4 Tunisia 0pts
-- Advance 1F and 2F to Round of 32 (match 76 team1, match 74 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('F', 1, 'Netherlands'),
  ('F', 2, 'Japan'),
  ('F', 3, 'Sweden'),
  ('F', 4, 'Tunisia')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'Netherlands'
WHERE id = 76 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Japan'
WHERE id = 74 AND stage = 'Round of 32';
