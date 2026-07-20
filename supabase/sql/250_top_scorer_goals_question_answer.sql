-- Top scorer finished on 10 goals. Close the "How many goals will the top scorer get?" question (3 pts).
UPDATE public.special_questions
SET correct_answer = '10'
WHERE id = 'a0000001-0000-4000-8000-000000000002'::uuid;
