-- Best player of the tournament was none of the listed pairs. Close the question with 'Other' (3 pts).
UPDATE public.special_questions
SET correct_answer = 'Other'
WHERE id = 'a0000001-0000-4000-8000-00000000000a'::uuid;
