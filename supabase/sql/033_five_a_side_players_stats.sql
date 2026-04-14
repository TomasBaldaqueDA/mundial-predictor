-- Stats columns on five_a_side_players: goals, assists, wins, clean_sheets, mvp (count).
-- MVP, wins and clean_sheets are refreshed from matches; goals/assists can be set manually or from match_events later.

ALTER TABLE public.five_a_side_players
  ADD COLUMN IF NOT EXISTS goals int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assists int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wins int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clean_sheets int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mvp int NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.five_a_side_players.mvp IS 'Number of times this player was MVP in finished matches.';
COMMENT ON COLUMN public.five_a_side_players.clean_sheets IS 'Clean sheets (only relevant for gk/df; points only for gk/df).';

-- Refresh mvp, wins, clean_sheets from finished matches. Leaves goals/assists unchanged.
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
  );

  -- Wins: count matches where this player's team won
  UPDATE public.five_a_side_players p
  SET wins = COALESCE(
    (SELECT COUNT(*)::int FROM public.matches m
     WHERE m.status = 'finished' AND m.score1 IS NOT NULL AND m.score2 IS NOT NULL
       AND ((m.team1 = p.team AND m.score1 > m.score2) OR (m.team2 = p.team AND m.score2 > m.score1))),
    0
  );

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
  END;
END;
$$;

-- Run once to populate from existing matches
SELECT public.refresh_five_a_side_player_stats();

-- Optional: trigger to refresh when a match is updated (can be heavy with many players)
CREATE OR REPLACE FUNCTION public.trigger_refresh_five_a_side_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.refresh_five_a_side_player_stats();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_refresh_five_a_side_stats ON public.matches;
CREATE TRIGGER trigger_refresh_five_a_side_stats
  AFTER INSERT OR UPDATE OF status, score1, score2, mvp
  ON public.matches
  FOR EACH STATEMENT
  EXECUTE PROCEDURE public.trigger_refresh_five_a_side_stats();

-- When matches are deleted, recalc player stats (mvp, wins, clean_sheets) so they drop to current match data
DROP TRIGGER IF EXISTS trigger_refresh_five_a_side_stats_on_delete ON public.matches;
CREATE TRIGGER trigger_refresh_five_a_side_stats_on_delete
  AFTER DELETE ON public.matches
  FOR EACH STATEMENT
  EXECUTE PROCEDURE public.trigger_refresh_five_a_side_stats();
