-- USA, Mexico and Canada all eliminated in Round of 16 (matches 90, 92, 94) — tie; answer Other/Tie.
UPDATE public.special_questions
SET
  correct_answer = 'Other/Tie',
  points = 2
WHERE id = 'a0000001-0000-4000-8000-000000000010'::uuid;
