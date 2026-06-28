-- Group stage complete: only Panama failed to score (0 goals in 3 matches).
UPDATE public.special_questions
SET
  correct_answer = '1',
  points = 2
WHERE id = 'a0000001-0000-4000-8000-00000000000c'::uuid;
