-- Compute group prediction points for one user (see GROUP_POINTS_RULES.md)
CREATE OR REPLACE FUNCTION public.calc_user_group_points(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  pos_pts int := 0;
  perfect_bonus int := 0;
  all_32_bonus int := 0;
  third_groups_bonus int := 0;
  actual_qual_count int;
  pred_qual_cnt int;
  pred_qual_hits int;
  actual_third_count int;
  user_third_distinct int;
  third_groups_match int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.group_actual_standings LIMIT 1) THEN
    RETURN 0;
  END IF;

  -- 1 pt per team in the correct position (1–4)
  SELECT COALESCE(COUNT(*), 0)::int INTO pos_pts
  FROM public.group_predictions p
  JOIN public.group_actual_standings a
    ON p.group_code = a.group_code AND p.position = a.position AND p.team_name = a.team_name
  WHERE p.user_id = p_user_id;

  -- +1 per group where all 4 positions are correct
  SELECT COALESCE(COUNT(*), 0)::int INTO perfect_bonus
  FROM (
    SELECT p.group_code
    FROM public.group_predictions p
    JOIN public.group_actual_standings a
      ON p.group_code = a.group_code AND p.position = a.position AND p.team_name = a.team_name
    WHERE p.user_id = p_user_id
    GROUP BY p.group_code
    HAVING COUNT(*) = 4
  ) g32;

  -- +10 if predicted qualifier set matches actual (32 teams)
  SELECT COUNT(*)::int INTO actual_qual_count
  FROM public.group_actual_standings a
  WHERE a.position <= 2
     OR (
       a.position = 3
       AND EXISTS (SELECT 1 FROM public.group_actual_third_place t WHERE t.group_code = a.group_code)
     );

  IF actual_qual_count = 32 THEN
    SELECT COUNT(*)::int INTO pred_qual_cnt
    FROM public.group_predictions p
    WHERE p.user_id = p_user_id
      AND (
        p.position <= 2
        OR (p.position = 3 AND COALESCE(p.qualifies, false))
      );

    SELECT COUNT(*)::int INTO pred_qual_hits
    FROM public.group_predictions p
    JOIN public.group_actual_standings a
      ON p.group_code = a.group_code AND p.team_name = a.team_name
    WHERE p.user_id = p_user_id
      AND (
        p.position <= 2
        OR (p.position = 3 AND COALESCE(p.qualifies, false))
      )
      AND (
        a.position <= 2
        OR (
          a.position = 3
          AND EXISTS (SELECT 1 FROM public.group_actual_third_place t WHERE t.group_code = a.group_code)
        )
      );

    IF pred_qual_cnt = 32 AND pred_qual_hits = 32 THEN
      all_32_bonus := 10;
    END IF;
  END IF;

  -- +5 if user identifies exactly the 8 groups whose 3rd place advances
  SELECT COUNT(*)::int INTO actual_third_count FROM public.group_actual_third_place;

  IF actual_third_count = 8 THEN
    SELECT COUNT(DISTINCT p.group_code)::int INTO user_third_distinct
    FROM public.group_predictions p
    WHERE p.user_id = p_user_id
      AND p.position = 3
      AND COALESCE(p.qualifies, false);

    IF user_third_distinct = 8 THEN
      SELECT COUNT(*)::int INTO third_groups_match
      FROM public.group_actual_third_place t
      WHERE EXISTS (
        SELECT 1 FROM public.group_predictions p
        WHERE p.user_id = p_user_id
          AND p.group_code = t.group_code
          AND p.position = 3
          AND COALESCE(p.qualifies, false)
      );

      IF third_groups_match = 8
         AND NOT EXISTS (
           SELECT 1 FROM public.group_predictions p
           WHERE p.user_id = p_user_id
             AND p.position = 3
             AND COALESCE(p.qualifies, false)
             AND NOT EXISTS (
               SELECT 1 FROM public.group_actual_third_place t WHERE t.group_code = p.group_code
             )
         )
      THEN
        third_groups_bonus := 5;
      END IF;
    END IF;
  END IF;

  RETURN pos_pts + perfect_bonus + all_32_bonus + third_groups_bonus;
END;
$$;

COMMENT ON FUNCTION public.calc_user_group_points IS
'Group predictions: 1 pt per correct position; +1 per perfect group; +10 if all 32 qualifiers match; +5 if the 8 advancing third-place groups are identified.';

-- Return (user_id, group_points) for all users who have group predictions (for ranking)
CREATE OR REPLACE FUNCTION public.get_all_group_points()
RETURNS TABLE(user_id uuid, group_points integer)
LANGUAGE sql
STABLE
AS $$
  SELECT u.id AS user_id, public.calc_user_group_points(u.id)::integer AS group_points
  FROM (SELECT DISTINCT gp.user_id AS id FROM public.group_predictions gp) u;
$$;
