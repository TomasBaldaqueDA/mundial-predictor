-- User answers to special questions. One row per (user_id, question_id).
CREATE TABLE IF NOT EXISTS public.special_answers (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.special_questions(id) ON DELETE CASCADE,
  answer text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

COMMENT ON TABLE public.special_answers IS 'User answers to special questions. Lock editing when first match kicks off.';

ALTER TABLE public.special_answers ENABLE ROW LEVEL SECURITY;

-- Users can read own answers
CREATE POLICY "Users can read own special_answers"
  ON public.special_answers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own answers
CREATE POLICY "Users can insert own special_answers"
  ON public.special_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own answers
CREATE POLICY "Users can update own special_answers"
  ON public.special_answers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
