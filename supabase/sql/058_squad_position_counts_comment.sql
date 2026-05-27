-- Clarify: squad position counts per nation are not fixed (only the user's 5-A-SIDE pick is 1+1+2+1).

COMMENT ON TABLE public.five_a_side_players IS
  'National squad pool for 5-A-SIDE and MVP lists. Position counts (gk/df/md/st) vary per team like real convocatorias; typically ~26 players. Each user picks 1 GK, 1 DF, 2 MD, 1 ST in five_a_side_picks. No player photos required.';
