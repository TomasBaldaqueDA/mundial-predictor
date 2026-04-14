-- Allow 'winner' type for special questions (team picker).
ALTER TABLE public.special_questions DROP CONSTRAINT IF EXISTS special_questions_type_check;
ALTER TABLE public.special_questions ADD CONSTRAINT special_questions_type_check
  CHECK (type IN ('text', 'number', 'winner'));
