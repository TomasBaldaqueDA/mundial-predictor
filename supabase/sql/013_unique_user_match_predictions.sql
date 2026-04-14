-- One prediction per user per match (for authenticated users)
CREATE UNIQUE INDEX IF NOT EXISTS predictions_user_match_unique
  ON public.predictions (user_id, match_id)
  WHERE user_id IS NOT NULL;
