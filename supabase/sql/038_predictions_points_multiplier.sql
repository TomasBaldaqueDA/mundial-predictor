-- x2 power-up: multiply final prediction points (1 or 2).

ALTER TABLE public.predictions
  ADD COLUMN IF NOT EXISTS points_multiplier smallint NOT NULL DEFAULT 1
  CHECK (points_multiplier IN (1, 2));

CREATE OR REPLACE FUNCTION public.recalc_predictions_points_on_match_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.predictions p
  SET points = public.calc_prediction_points(
    NEW.score1,
    NEW.score2,
    NEW.mvp,
    NEW.qualifier,
    p.pred_score1,
    p.pred_score2,
    p.pred_mvp,
    p.pred_qualifier
  ) * COALESCE(p.points_multiplier, 1)
  WHERE p.match_id = NEW.id;
  RETURN NEW;
END;
$$;
