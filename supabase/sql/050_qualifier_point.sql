-- Knockout qualifier prediction: +1 pt for correctly picking the advancing team.
-- Also update recalc trigger and guard (same as 049, kept idempotent).

CREATE OR REPLACE FUNCTION public.calc_prediction_points(
  p_score1 bigint,
  p_score2 bigint,
  p_mvp text,
  p_qualifier text,
  pred_score1 bigint,
  pred_score2 bigint,
  pred_mvp text,
  pred_qualifier text
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  exact boolean;
  match_winner int;
  pred_winner int;
  correct_winner boolean;
  mvp_correct boolean;
  qualifier_correct boolean;
  exact_pts int;
  winner_pts int;
  mvp_pts int;
  combo_pts int;
  qualifier_pts int;
BEGIN
  IF p_score1 IS NULL OR p_score2 IS NULL THEN
    RETURN 0;
  END IF;

  exact := (pred_score1 = p_score1 AND pred_score2 = p_score2);

  match_winner := CASE
    WHEN p_score1 > p_score2 THEN 1
    WHEN p_score1 < p_score2 THEN 2
    ELSE 0
  END;

  pred_winner := CASE
    WHEN pred_score1 > pred_score2 THEN 1
    WHEN pred_score1 < pred_score2 THEN 2
    ELSE 0
  END;

  correct_winner := NOT exact AND (match_winner = pred_winner);

  mvp_correct := (
    p_mvp IS NOT NULL
    AND p_mvp <> ''
    AND trim(lower(p_mvp)) = trim(lower(coalesce(pred_mvp, '')))
  );

  qualifier_correct := (
    p_qualifier IS NOT NULL
    AND p_qualifier <> ''
    AND pred_qualifier IS NOT NULL
    AND pred_qualifier <> ''
    AND trim(lower(p_qualifier)) = trim(lower(pred_qualifier))
  );

  exact_pts     := CASE WHEN exact            THEN 3 ELSE 0 END;
  winner_pts    := CASE WHEN correct_winner   THEN 1 ELSE 0 END;
  mvp_pts       := CASE WHEN mvp_correct      THEN 1 ELSE 0 END;
  combo_pts     := CASE WHEN exact AND mvp_correct THEN 1 ELSE 0 END;
  qualifier_pts := CASE WHEN qualifier_correct THEN 1 ELSE 0 END;

  RETURN exact_pts + winner_pts + mvp_pts + combo_pts + qualifier_pts;
END;
$$;

COMMENT ON FUNCTION public.calc_prediction_points(bigint,bigint,text,text,bigint,bigint,text,text) IS
'Match prediction: exact score 3, correct outcome (not exact) 1, MVP 1, combo exact+MVP +1, correct knockout qualifier +1.';

-- Fix recalc trigger (8-arg, with multiplier)
CREATE OR REPLACE FUNCTION public.recalc_predictions_points_on_match_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.predictions
  SET points = public.calc_prediction_points(
    NEW.score1, NEW.score2, NEW.mvp, NEW.qualifier,
    pred_score1, pred_score2, pred_mvp, pred_qualifier
  ) * COALESCE(points_multiplier, 1)
  WHERE match_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Fix guard: allow trigger/cron context (auth.uid() IS NULL) to update points
CREATE OR REPLACE FUNCTION public.guard_predictions_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  kickoff timestamptz;
BEGIN
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

-- Recalculate all existing predictions for finished matches
UPDATE public.predictions p
SET points = public.calc_prediction_points(
  m.score1, m.score2, m.mvp, m.qualifier,
  p.pred_score1, p.pred_score2, p.pred_mvp, p.pred_qualifier
) * COALESCE(p.points_multiplier, 1)
FROM public.matches m
WHERE p.match_id = m.id
  AND m.score1 IS NOT NULL
  AND m.score2 IS NOT NULL;
