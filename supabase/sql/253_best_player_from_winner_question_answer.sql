-- Best player of the tournament was from the winning team. Close the question with 'Yes' (1 pt).
UPDATE public.special_questions
SET correct_answer = 'Yes'
WHERE id = 'a0000001-0000-4000-8000-00000000000e'::uuid;
