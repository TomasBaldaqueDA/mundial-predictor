-- Add multiple choice / true-false support: options (JSON array of strings) and type 'choice'.
ALTER TABLE public.special_questions
  ADD COLUMN IF NOT EXISTS options jsonb NOT NULL DEFAULT '[]';

ALTER TABLE public.special_questions DROP CONSTRAINT IF EXISTS special_questions_type_check;
ALTER TABLE public.special_questions ADD CONSTRAINT special_questions_type_check
  CHECK (type IN ('text', 'number', 'winner', 'choice'));

COMMENT ON COLUMN public.special_questions.options IS 'For type=choice: array of option strings, e.g. ["Yes", "No"] or ["A) First", "B) Second"]. User answer stores the selected string.';
