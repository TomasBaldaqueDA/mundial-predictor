-- Fix 1: Update the recalc trigger to call the correct 8-arg calc_prediction_points
-- (migration 040 dropped the old 6-arg version but the trigger wasn't updated)
CREATE OR REPLACE FUNCTION public.recalc_predictions_points_on_match_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.predictions
  SET points = public.calc_prediction_points(
    NEW.score1,
    NEW.score2,
    NEW.mvp,
    NEW.qualifier,
    pred_score1,
    pred_score2,
    pred_mvp,
    pred_qualifier
  ) * COALESCE(points_multiplier, 1)
  WHERE match_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Fix 2: Update the guard trigger so that trigger/cron context (auth.uid() IS NULL)
-- can still write points. Only block authenticated users from changing their own points.
CREATE OR REPLACE FUNCTION public.guard_predictions_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  kickoff timestamptz;
BEGIN
  -- Allow system/trigger/service-role to update points freely.
  -- Block only JWT-bearing requests that aren't service_role.
  IF NEW.points IS DISTINCT FROM OLD.points THEN
    IF auth.uid() IS NOT NULL AND auth.role() IS DISTINCT FROM 'service_role' THEN
      NEW.points := OLD.points;
    END IF;
  END IF;

  SELECT m.kickoff_time INTO kickoff
  FROM public.matches m
  WHERE m.id = NEW.match_id;

  IF kickoff IS NOT NULL AND kickoff <= now() THEN
    IF NEW.pred_score1 IS DISTINCT FROM OLD.pred_score1
       OR NEW.pred_score2 IS DISTINCT FROM OLD.pred_score2
       OR NEW.pred_mvp IS DISTINCT FROM OLD.pred_mvp
       OR NEW.pred_qualifier IS DISTINCT FROM OLD.pred_qualifier
       OR NEW.points_multiplier IS DISTINCT FROM OLD.points_multiplier THEN
      RAISE EXCEPTION 'predictions locked after kickoff';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Fix 3: Recalculate points for all predictions of finished matches right now
UPDATE public.predictions p
SET points = public.calc_prediction_points(
  m.score1,
  m.score2,
  m.mvp,
  m.qualifier,
  p.pred_score1,
  p.pred_score2,
  p.pred_mvp,
  p.pred_qualifier
) * COALESCE(p.points_multiplier, 1)
FROM public.matches m
WHERE p.match_id = m.id
  AND m.score1 IS NOT NULL
  AND m.score2 IS NOT NULL;
