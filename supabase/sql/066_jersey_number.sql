-- Optional official shirt number per squad player (used in 5-A-SIDE kit UI when set).

ALTER TABLE public.five_a_side_players
  ADD COLUMN IF NOT EXISTS jersey_number smallint;

COMMENT ON COLUMN public.five_a_side_players.jersey_number IS
  'Official squad shirt number when known; 5-A-SIDE UI prefers this over alphabetical index.';
