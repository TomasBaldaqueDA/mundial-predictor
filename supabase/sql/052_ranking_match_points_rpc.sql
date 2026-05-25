-- Efficient match-points aggregation for the global ranking page.
-- Only counts predictions on finished matches with known results.

CREATE OR REPLACE FUNCTION public.get_match_points_by_user()
RETURNS TABLE(user_id uuid, match_points bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    COALESCE(SUM(p.points), 0)::bigint AS match_points
  FROM public.predictions p
  INNER JOIN public.matches m ON m.id = p.match_id
  WHERE p.user_id IS NOT NULL
    AND m.status = 'finished'
    AND m.score1 IS NOT NULL
    AND m.score2 IS NOT NULL
  GROUP BY p.user_id;
$$;

COMMENT ON FUNCTION public.get_match_points_by_user() IS
'Sum prediction points per user for finished matches — used by global ranking.';

GRANT EXECUTE ON FUNCTION public.get_match_points_by_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_match_points_by_user() TO anon;
