-- Função: calcula pontos de uma previsão dado o resultado do jogo (mesma lógica que lib/points.ts)
create or replace function public.calc_prediction_points(
  p_score1 bigint,
  p_score2 bigint,
  p_mvp text,
  pred_score1 bigint,
  pred_score2 bigint,
  pred_mvp text
)
returns integer
language plpgsql
immutable
as $$
declare
  exact boolean;
  match_winner int;
  pred_winner int;
  correct_winner boolean;
  mvp_correct boolean;
  exact_pts int;
  winner_pts int;
  mvp_pts int;
  combo_pts int;
begin
  if p_score1 is null or p_score2 is null then
    return 0;
  end if;

  exact := (pred_score1 = p_score1 and pred_score2 = p_score2);

  match_winner := case
    when p_score1 > p_score2 then 1
    when p_score1 < p_score2 then 2
    else 0
  end;

  pred_winner := case
    when pred_score1 > pred_score2 then 1
    when pred_score1 < pred_score2 then 2
    else 0
  end;

  correct_winner := not exact and (match_winner = pred_winner);

  mvp_correct := (
    p_mvp is not null
    and p_mvp <> ''
    and trim(lower(p_mvp)) = trim(lower(coalesce(pred_mvp, '')))
  );

  exact_pts := case when exact then 5 else 0 end;
  winner_pts := case when correct_winner then 3 else 0 end;
  mvp_pts := case when mvp_correct then 3 else 0 end;
  combo_pts := case when exact and mvp_correct then 2 else 0 end;

  return exact_pts + winner_pts + mvp_pts + combo_pts;
end;
$$;

-- Trigger: quando score1, score2 ou mvp de um jogo são alterados, recalcula pontos de todas as previsões desse jogo
create or replace function public.recalc_predictions_points_on_match_update()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.predictions
  set points = public.calc_prediction_points(
    new.score1,
    new.score2,
    new.mvp,
    pred_score1,
    pred_score2,
    pred_mvp
  )
  where match_id = new.id;
  return new;
end;
$$;

drop trigger if exists trigger_recalc_points_on_match_update on public.matches;

create trigger trigger_recalc_points_on_match_update
  after update of score1, score2, mvp
  on public.matches
  for each row
  execute function public.recalc_predictions_points_on_match_update();
