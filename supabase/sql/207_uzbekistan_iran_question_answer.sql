-- Group stage complete: Uzbekistan (4th, Group K) and IR Iran (3rd, Group G) both eliminated.
UPDATE public.special_questions
SET
  correct_answer = 'Tie',
  points = 3
WHERE id = 'a0000001-0000-4000-8000-00000000000b'::uuid;
