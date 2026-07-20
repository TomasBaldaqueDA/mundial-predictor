-- Fastest goal of the tournament fell in the 01:00-02:59 range. Close the question (2 pts).
UPDATE public.special_questions
SET correct_answer = '01:00-02:59'
WHERE id = 'a0000001-0000-4000-8000-000000000011'::uuid;
