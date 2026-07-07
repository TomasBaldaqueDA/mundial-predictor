-- Special questions resolved after Portugal R16 exit (match 93) and tournament progress to date.

UPDATE public.special_questions
SET
  correct_answer = 'Round of 16 / Quarter-finals',
  points = 2
WHERE id = 'a0000001-0000-4000-8000-000000000005'::uuid;

UPDATE public.special_questions
SET
  correct_answer = 'Messi',
  points = 2
WHERE id = 'a0000001-0000-4000-8000-000000000007'::uuid;

UPDATE public.special_questions
SET
  correct_answer = 'No',
  points = 1
WHERE id = 'a0000001-0000-4000-8000-000000000009'::uuid;

UPDATE public.special_questions
SET
  correct_answer = '5-6',
  points = 2
WHERE id = 'a0000001-0000-4000-8000-000000000013'::uuid;
