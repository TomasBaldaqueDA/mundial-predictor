-- Fix "UPDATE requires a WHERE clause" on projects with safe-update guard enabled.
-- This function is called by triggers on public.matches updates/inserts.

CREATE OR REPLACE FUNCTION public.refresh_five_a_side_player_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- MVP: count matches where this player's name = match.mvp
  UPDATE public.five_a_side_players p
  SET mvp = COALESCE(
    (SELECT COUNT(*)::int FROM public.matches m
     WHERE m.status = 'finished' AND m.mvp IS NOT NULL AND m.mvp <> ''
       AND trim(lower(m.mvp)) = trim(lower(p.name))),
    0
  )
  WHERE TRUE;

  -- Wins: count matches where this player's team won
  UPDATE public.five_a_side_players p
  SET wins = COALESCE(
    (SELECT COUNT(*)::int FROM public.matches m
     WHERE m.status = 'finished' AND m.score1 IS NOT NULL AND m.score2 IS NOT NULL
       AND ((m.team1 = p.team AND m.score1 > m.score2) OR (m.team2 = p.team AND m.score2 > m.score1))),
    0
  )
  WHERE TRUE;

  -- Clean sheets: only for gk and df; count matches where player's team conceded 0
  UPDATE public.five_a_side_players p
  SET clean_sheets = CASE
    WHEN p.position NOT IN ('gk', 'df') THEN 0
    ELSE COALESCE(
      (SELECT COUNT(*)::int FROM public.matches m
       WHERE m.status = 'finished' AND m.score1 IS NOT NULL AND m.score2 IS NOT NULL
         AND ((m.team1 = p.team AND m.score2 = 0) OR (m.team2 = p.team AND m.score1 = 0))),
      0
    )
  END
  WHERE TRUE;
END;
$$;

