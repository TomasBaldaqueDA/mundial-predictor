-- Actual group standings (fill when group stage is finished)
-- One row per (group_code, position): the team that finished in that position
CREATE TABLE IF NOT EXISTS public.group_actual_standings (
  group_code text NOT NULL,
  position int NOT NULL CHECK (position >= 1 AND position <= 4),
  team_name text NOT NULL,
  PRIMARY KEY (group_code, position)
);

-- The 8 groups whose 3rd place advances (fill when known)
CREATE TABLE IF NOT EXISTS public.group_actual_third_place (
  group_code text NOT NULL PRIMARY KEY
);

ALTER TABLE public.group_actual_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_actual_third_place ENABLE ROW LEVEL SECURITY;

-- Everyone can read (for ranking and display)
CREATE POLICY "Anyone can read group_actual_standings"
  ON public.group_actual_standings FOR SELECT USING (true);
CREATE POLICY "Anyone can read group_actual_third_place"
  ON public.group_actual_third_place FOR SELECT USING (true);

-- Only service role / admin should insert/update/delete (no policy = deny for anon; add later if needed)
COMMENT ON TABLE public.group_actual_standings IS 'Real final position (1-4) per team per group. Fill when group stage ends.';
COMMENT ON TABLE public.group_actual_third_place IS 'Exactly 8 group_codes: those whose 3rd place advances.';
