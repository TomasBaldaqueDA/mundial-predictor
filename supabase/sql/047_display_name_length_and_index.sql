-- Cap display_name length to avoid 10k-char names from rendering badly.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_display_name_length;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length
  CHECK (char_length(display_name) <= 40);

-- Help the global ranking query (predictions ordered by user_id w/ points).
CREATE INDEX IF NOT EXISTS predictions_user_points_idx
  ON public.predictions (user_id)
  WHERE user_id IS NOT NULL;
