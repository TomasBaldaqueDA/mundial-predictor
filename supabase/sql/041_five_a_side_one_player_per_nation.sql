-- Enforce at most one player per national team in each user's 5-A-SIDE lineup.

CREATE OR REPLACE FUNCTION public.enforce_five_a_side_distinct_teams()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pick_count int;
  distinct_teams int;
BEGIN
  SELECT COUNT(*)::int, COUNT(DISTINCT p.team)::int
  INTO pick_count, distinct_teams
  FROM (
    SELECT NEW.gk_player_id AS id
    UNION ALL SELECT NEW.df_player_id
    UNION ALL SELECT NEW.md1_player_id
    UNION ALL SELECT NEW.md2_player_id
    UNION ALL SELECT NEW.st_player_id
  ) u
  JOIN public.five_a_side_players p ON p.id = u.id
  WHERE u.id IS NOT NULL;

  IF pick_count > 1 AND pick_count IS DISTINCT FROM distinct_teams THEN
    RAISE EXCEPTION '5-A-SIDE: only one player per national team (duplicate nation in lineup).'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_five_a_side_distinct_teams ON public.five_a_side_picks;
CREATE TRIGGER trg_five_a_side_distinct_teams
  BEFORE INSERT OR UPDATE ON public.five_a_side_picks
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_five_a_side_distinct_teams();

COMMENT ON FUNCTION public.enforce_five_a_side_distinct_teams() IS 'Rejects picks where two slots reference players from the same five_a_side_players.team.';
COMMENT ON TABLE public.five_a_side_picks IS 'Each user picks 1 GK, 1 DF, 2 MD, 1 ST. At most one player per national team. Locked at first match or when submitted.';
