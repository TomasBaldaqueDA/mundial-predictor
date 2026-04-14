-- Example special questions (run manually or as seed). Run 023_special_questions_winner_type.sql first.
INSERT INTO public.special_questions (id, question, type, points, sort_order)
VALUES
  ('a0000001-0000-4000-8000-000000000000'::uuid, 'Winner', 'winner', 20, 0),
  ('a0000001-0000-4000-8000-000000000001'::uuid, 'Who will be top scorer at the 2026 World Cup?', 'text', 5, 1),
  ('a0000001-0000-4000-8000-000000000002'::uuid, 'How many goals will the top scorer get?', 'number', 10, 2)
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  type = EXCLUDED.type,
  points = EXCLUDED.points,
  sort_order = EXCLUDED.sort_order;
