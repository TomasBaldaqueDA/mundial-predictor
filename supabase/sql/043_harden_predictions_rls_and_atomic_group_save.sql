-- B-02 / B-08: predictions INSERT must require auth.uid() = user_id (not null).
-- The previous policy `WITH CHECK (true)` allowed impersonation and anonymous spam.
DROP POLICY IF EXISTS "Anyone can insert predictions" ON public.predictions;
CREATE POLICY "Auth user can insert own prediction"
  ON public.predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Optional DELETE policy so users can remove their own (currently no policy = blocked).
DROP POLICY IF EXISTS "Users can delete own predictions" ON public.predictions;
CREATE POLICY "Users can delete own predictions"
  ON public.predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- B-10: Atomic group save (single transaction; rollback on error).
CREATE OR REPLACE FUNCTION public.save_group_predictions(
  p_group_code text,
  p_pos1 text,
  p_pos2 text,
  p_pos3 text,
  p_pos4 text,
  p_third_qualifies boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  valid_count int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT count(*) INTO valid_count
  FROM public.group_teams
  WHERE group_code = p_group_code
    AND team_name IN (p_pos1, p_pos2, p_pos3, p_pos4);
  IF valid_count <> 4 THEN
    RAISE EXCEPTION 'invalid teams for group %', p_group_code;
  END IF;

  IF (SELECT count(*) FROM (VALUES (p_pos1),(p_pos2),(p_pos3),(p_pos4)) v(t)) <>
     (SELECT count(DISTINCT t) FROM (VALUES (p_pos1),(p_pos2),(p_pos3),(p_pos4)) v(t)) THEN
    RAISE EXCEPTION 'duplicate teams in group %', p_group_code;
  END IF;

  DELETE FROM public.group_predictions
   WHERE user_id = uid AND group_code = p_group_code;

  INSERT INTO public.group_predictions (user_id, group_code, team_name, position, qualifies) VALUES
    (uid, p_group_code, p_pos1, 1, true),
    (uid, p_group_code, p_pos2, 2, true),
    (uid, p_group_code, p_pos3, 3, p_third_qualifies),
    (uid, p_group_code, p_pos4, 4, false);
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_group_predictions(text, text, text, text, text, boolean) TO authenticated;
