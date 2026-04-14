-- Allow everyone to read group_predictions (for group view page)
DROP POLICY IF EXISTS "Users can read own group_predictions" ON public.group_predictions;
CREATE POLICY "Anyone can read group_predictions"
  ON public.group_predictions FOR SELECT
  USING (true);
