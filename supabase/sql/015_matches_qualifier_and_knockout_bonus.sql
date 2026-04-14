-- Coluna na tabela matches para a equipa que avançou (eliminatórias)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS qualifier text;

-- Pontos de jogo (90'): resultado + MVP + combo; parâmetros qualifier mantidos na assinatura sem pontuação.
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
  exact_pts int;
  winner_pts int;
  mvp_pts int;
  combo_pts int;
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

  exact_pts := CASE WHEN exact THEN 3 ELSE 0 END;
  winner_pts := CASE WHEN correct_winner THEN 1 ELSE 0 END;
  mvp_pts := CASE WHEN mvp_correct THEN 1 ELSE 0 END;
  combo_pts := CASE WHEN exact AND mvp_correct THEN 1 ELSE 0 END;

  RETURN exact_pts + winner_pts + mvp_pts + combo_pts;
END;
$$;

-- Trigger: recalcula pontos quando score1, score2, mvp ou qualifier do jogo mudam
CREATE OR REPLACE FUNCTION public.recalc_predictions_points_on_match_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.predictions
  SET points = public.calc_prediction_points(
    new.score1,
    new.score2,
    new.mvp,
    new.qualifier,
    pred_score1,
    pred_score2,
    pred_mvp,
    pred_qualifier
  )
  WHERE match_id = new.id;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trigger_recalc_points_on_match_update ON public.matches;

CREATE TRIGGER trigger_recalc_points_on_match_update
  AFTER UPDATE OF score1, score2, mvp, qualifier
  ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.recalc_predictions_points_on_match_update();
