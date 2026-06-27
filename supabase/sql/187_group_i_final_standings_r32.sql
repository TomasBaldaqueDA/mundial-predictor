-- Group I final standings (after matches 17, 18, 42, 43, 61, 62)
-- 1 France 9pts | 2 Norway 6pts | 3 Senegal 3pts | 4 Iraq 0pts
-- Advance 1I and 2I to Round of 32 (match 78 team1, match 77 team2)

INSERT INTO public.group_actual_standings (group_code, position, team_name) VALUES
  ('I', 1, 'France'),
  ('I', 2, 'Norway'),
  ('I', 3, 'Senegal'),
  ('I', 4, 'Iraq')
ON CONFLICT (group_code, position) DO UPDATE SET team_name = EXCLUDED.team_name;

UPDATE public.matches SET team1 = 'France'
WHERE id = 78 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Norway'
WHERE id = 77 AND stage = 'Round of 32';
