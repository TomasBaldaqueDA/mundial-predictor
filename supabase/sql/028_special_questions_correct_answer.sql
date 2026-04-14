-- Store official correct answer per question; when set, we show correct/incorrect and points.
ALTER TABLE public.special_questions
  ADD COLUMN IF NOT EXISTS correct_answer text NULL;

COMMENT ON COLUMN public.special_questions.correct_answer IS 'Official correct answer; when set, user answers are shown as correct (green tick + points) or incorrect (red cross + 0 pts + correct answer).';
