-- Launch hardening: users cannot edit picks after kickoff or tamper with points.

CREATE OR REPLACE FUNCTION public.guard_predictions_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  kickoff timestamptz;
BEGIN
  -- Only service/cron should change computed points.
  IF NEW.points IS DISTINCT FROM OLD.points THEN
    IF auth.role() IS DISTINCT FROM 'service_role' THEN
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

DROP TRIGGER IF EXISTS trg_guard_predictions_update ON public.predictions;
CREATE TRIGGER trg_guard_predictions_update
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_predictions_update();
