-- Allow updates to own predictions (fixes edit not persisting when RLS is on)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read predictions" ON public.predictions;
CREATE POLICY "Anyone can read predictions"
  ON public.predictions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert predictions" ON public.predictions;
CREATE POLICY "Anyone can insert predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own predictions" ON public.predictions;
CREATE POLICY "Users can update own predictions"
  ON public.predictions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
