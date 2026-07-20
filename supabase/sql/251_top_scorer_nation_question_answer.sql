-- World Cup top scorer is from France. Close the "Which national team will the World Cup top scorer be from?" question (3 pts).
UPDATE public.special_questions
SET correct_answer = 'France'
WHERE id = 'a0000001-0000-4000-8000-000000000006'::uuid;
