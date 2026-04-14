-- Example choice and true/false questions. Run 025_special_questions_choice_options.sql first.
INSERT INTO public.special_questions (id, question, type, points, sort_order, options)
VALUES
  ('a0000001-0000-4000-8000-000000000003'::uuid, 'How many teams qualify from each group?', 'choice', 2, 3, '["1", "2", "3", "4"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000004'::uuid, 'The 2026 World Cup is hosted by USA, Mexico and Canada.', 'choice', 1, 4, '["True", "False"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000005'::uuid, 'In which round will Portugal be eliminated?', 'choice', 3, 5, '["Group stage / Round of 32", "Round of 16 / Quarter-finals", "Semi-finals", "Final", "Won''t be eliminated"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000006'::uuid, 'Which national team will the World Cup top scorer be from?', 'choice', 10, 6, '["Portugal", "Spain", "Brazil", "Argentina", "France", "Other"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000007'::uuid, 'Which of these will score more goals?', 'choice', 5, 7, '["Messi", "Ronaldo"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000008'::uuid, 'Will Curaçao get past the group stage?', 'choice', 3, 8, '["Yes", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000009'::uuid, 'Will another goalkeeper besides Diogo Costa play for Portugal during the World Cup?', 'choice', 3, 9, '["Yes", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000a'::uuid, 'Who do you think will be the best player of the tournament?', 'choice', 10, 10, '["Ronaldo/Messi", "Vitinha/Pedri", "Lamine/Raphinha", "Dembele/Vinicius", "Nuno Mendes/Hakimi", "Other"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000b'::uuid, 'Will Uzbekistan go further than Iran?', 'choice', 3, 11, '["Yes", "Tie", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000c'::uuid, 'How many teams will not score at least 1 goal in the World Cup?', 'choice', 5, 12, '["0", "1", "2", "3", "4 or more"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000d'::uuid, 'Will the winner win all their games in 90 minutes?', 'choice', 2, 13, '["Yes", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000e'::uuid, 'Will the best player of the tournament be from the winning team?', 'choice', 3, 14, '["Yes", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-00000000000f'::uuid, 'Who will have the most goals & assists among these players?', 'choice', 5, 15, '["Michael Olise", "Cole Palmer", "João Pedro", "Haaland", "2 or more tied"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000010'::uuid, 'Which of these North American teams will go furthest?', 'choice', 3, 16, '["USA", "Mexico", "Canada", "Other/Tie"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000011'::uuid, 'In which minute range will the fastest goal be scored?', 'choice', 5, 17, '["00:00-00:59", "01:00-02:59", "03:00-05:59", "06:00-09:59", "10:00-90:00"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000012'::uuid, 'Will Portugal finish first in their group?', 'choice', 2, 18, '["Yes", "No"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000013'::uuid, 'How many Portuguese players will score?', 'choice', 5, 19, '["0-2", "3-4", "5-6", "7-8", "9+"]'::jsonb),
  ('a0000001-0000-4000-8000-000000000014'::uuid, 'Will any non-European team reach the final?', 'choice', 2, 20, '["Yes", "No"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  type = EXCLUDED.type,
  points = EXCLUDED.points,
  sort_order = EXCLUDED.sort_order,
  options = EXCLUDED.options;
