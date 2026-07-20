-- Most goals & assists among the listed players ended in a tie. Close the question with '2 or more tied' (2 pts).
UPDATE public.special_questions
SET correct_answer = '2 or more tied'
WHERE id = 'a0000001-0000-4000-8000-00000000000f'::uuid;
