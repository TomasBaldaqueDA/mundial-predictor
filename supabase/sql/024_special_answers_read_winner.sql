-- Allow everyone to read special_answers (so winner predictions can be shown after tournament starts).
CREATE POLICY "Anyone can read special_answers"
  ON public.special_answers FOR SELECT
  USING (true);
