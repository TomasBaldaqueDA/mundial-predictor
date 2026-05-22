-- Players pool for 5-A-SIDE fantasy. Team = country name (matches TEAMS_BY_GROUP).
CREATE TABLE IF NOT EXISTS public.five_a_side_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL CHECK (position IN ('gk', 'df', 'md', 'st')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_five_a_side_players_team ON public.five_a_side_players(team);
CREATE INDEX IF NOT EXISTS idx_five_a_side_players_position ON public.five_a_side_players(position);

COMMENT ON TABLE public.five_a_side_players IS
  'Squad pool for 5-A-SIDE (typically 26 per nation: 3 GK + outfield) and MVP pick lists; each user picks 1 GK, 1 DF, 2 MD, 1 ST from five_a_side_picks. Optional photo_url (045) for card headshots.';

ALTER TABLE public.five_a_side_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read five_a_side_players"
  ON public.five_a_side_players FOR SELECT USING (true);
