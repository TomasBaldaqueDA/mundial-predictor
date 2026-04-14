-- Special questions (pre-tournament quiz). Admin inserts questions; users answer before first match.
CREATE TABLE IF NOT EXISTS public.special_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'number')),
  points integer NOT NULL DEFAULT 1 CHECK (points >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.special_questions IS 'Pre-tournament special questions. Answers locked at first match kickoff.';

ALTER TABLE public.special_questions ENABLE ROW LEVEL SECURITY;

-- Everyone can read questions
CREATE POLICY "Anyone can read special_questions"
  ON public.special_questions FOR SELECT USING (true);

-- Only service role can insert/update/delete (no policy for anon/auth = deny)
