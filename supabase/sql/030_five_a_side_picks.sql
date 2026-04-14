-- User 5-A-SIDE team (5 players). Locked when submitted or when first match kicks off.
CREATE TABLE IF NOT EXISTS public.five_a_side_picks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gk_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  df_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  md1_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  md2_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  st_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  submitted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.five_a_side_picks IS 'Each user picks 1 GK, 1 DF, 2 MD, 1 ST. Locked at first match or when submitted.';

ALTER TABLE public.five_a_side_picks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own five_a_side_picks"
  ON public.five_a_side_picks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own five_a_side_picks"
  ON public.five_a_side_picks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own five_a_side_picks"
  ON public.five_a_side_picks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow reading all picks (for "view teams" / leaderboard later)
CREATE POLICY "Anyone can read five_a_side_picks"
  ON public.five_a_side_picks FOR SELECT USING (true);
