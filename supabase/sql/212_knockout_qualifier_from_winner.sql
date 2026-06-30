-- Knockout qualifier scoring: award +1 when predicted advancing team matches the
-- winner by score, not only when matches.qualifier is set (PSO draws).
-- Also backfill qualifier on finished knockout wins for display.

DROP FUNCTION IF EXISTS public.calc_prediction_points(bigint, bigint, text, text, bigint, bigint, text, text);

CREATE OR REPLACE FUNCTION public.calc_prediction_points(
  p_score1 bigint,
  p_score2 bigint,
  p_mvp text,
  p_qualifier text,
  p_team1 text,
  p_team2 text,
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
  effective_qualifier text;
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

  effective_qualifier := COALESCE(
    NULLIF(trim(p_qualifier), ''),
    CASE
      WHEN p_score1 > p_score2 THEN NULLIF(trim(p_team1), '')
      WHEN p_score2 > p_score1 THEN NULLIF(trim(p_team2), '')
      ELSE NULL
    END
  );

  qualifier_correct := (
    effective_qualifier IS NOT NULL
    AND pred_qualifier IS NOT NULL
    AND pred_qualifier <> ''
    AND trim(lower(effective_qualifier)) = trim(lower(pred_qualifier))
  );

  exact_pts     := CASE WHEN exact             THEN 3 ELSE 0 END;
  winner_pts    := CASE WHEN correct_winner    THEN 1 ELSE 0 END;
  mvp_pts       := CASE WHEN mvp_correct       THEN 1 ELSE 0 END;
  combo_pts     := CASE WHEN exact AND mvp_correct THEN 1 ELSE 0 END;
  qualifier_pts := CASE WHEN qualifier_correct THEN 1 ELSE 0 END;

  RETURN exact_pts + winner_pts + mvp_pts + combo_pts + qualifier_pts;
END;
$$;

COMMENT ON FUNCTION public.calc_prediction_points(bigint,bigint,text,text,text,text,bigint,bigint,text,text) IS
'Match prediction: exact score 3, correct outcome (not exact) 1, MVP 1, combo exact+MVP +1, correct knockout qualifier +1.';

DROP FUNCTION IF EXISTS public.final_prediction_points(bigint, bigint, text, text, bigint, bigint, text, text, smallint);

CREATE OR REPLACE FUNCTION public.final_prediction_points(
  p_score1 bigint,
  p_score2 bigint,
  p_mvp text,
  p_qualifier text,
  p_team1 text,
  p_team2 text,
  pred_score1 bigint,
  pred_score2 bigint,
  pred_mvp text,
  pred_qualifier text,
  mult smallint
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base integer;
  exact boolean;
BEGIN
  base := public.calc_prediction_points(
    p_score1, p_score2, p_mvp, p_qualifier, p_team1, p_team2,
    pred_score1, pred_score2, pred_mvp, pred_qualifier
  );
  mult := COALESCE(mult, 1);

  IF mult = 3 THEN
    IF p_score1 IS NULL OR p_score2 IS NULL THEN
      RETURN 0;
    END IF;
    exact := (pred_score1 = p_score1 AND pred_score2 = p_score2);
    IF exact THEN
      RETURN base * 3;
    END IF;
    RETURN 0;
  ELSIF mult = 2 THEN
    RETURN base * 2;
  END IF;

  RETURN base;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalc_predictions_points_on_match_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.predictions p
  SET points = public.final_prediction_points(
    NEW.score1,
    NEW.score2,
    NEW.mvp,
    NEW.qualifier,
    NEW.team1,
    NEW.team2,
    p.pred_score1,
    p.pred_score2,
    p.pred_mvp,
    p.pred_qualifier,
    p.points_multiplier
  )
  WHERE p.match_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Backfill qualifier on knockout wins (PSO draws already have qualifier set)
UPDATE public.matches
SET qualifier = team1
WHERE stage IS DISTINCT FROM 'First Stage'
  AND status = 'finished'
  AND score1 IS NOT NULL
  AND score2 IS NOT NULL
  AND score1 > score2
  AND (qualifier IS NULL OR trim(qualifier) = '');

UPDATE public.matches
SET qualifier = team2
WHERE stage IS DISTINCT FROM 'First Stage'
  AND status = 'finished'
  AND score1 IS NOT NULL
  AND score2 IS NOT NULL
  AND score2 > score1
  AND (qualifier IS NULL OR trim(qualifier) = '');

-- Recalculate stored points for finished matches
UPDATE public.predictions p
SET points = public.final_prediction_points(
  m.score1,
  m.score2,
  m.mvp,
  m.qualifier,
  m.team1,
  m.team2,
  p.pred_score1,
  p.pred_score2,
  p.pred_mvp,
  p.pred_qualifier,
  p.points_multiplier
)
FROM public.matches m
WHERE p.match_id = m.id
  AND m.score1 IS NOT NULL
  AND m.score2 IS NOT NULL;
