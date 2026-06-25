-- Group E closed: Curaçao finished 4th and did not advance.
UPDATE public.special_questions
SET
  correct_answer = 'No',
  points = 1
WHERE id = 'a0000001-0000-4000-8000-000000000008'::uuid;
