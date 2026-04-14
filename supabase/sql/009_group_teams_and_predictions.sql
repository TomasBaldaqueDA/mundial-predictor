-- Group teams: 4 teams per group (A-L), used for group standings prediction
CREATE TABLE IF NOT EXISTS public.group_teams (
  group_code text NOT NULL,
  team_name text NOT NULL,
  PRIMARY KEY (group_code, team_name)
);

-- User predictions: predicted position (1-4) per team per group
CREATE TABLE IF NOT EXISTS public.group_predictions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_code text NOT NULL,
  team_name text NOT NULL,
  position int NOT NULL CHECK (position >= 1 AND position <= 4),
  PRIMARY KEY (user_id, group_code, position),
  UNIQUE (user_id, group_code, team_name),
  FOREIGN KEY (group_code, team_name) REFERENCES public.group_teams(group_code, team_name)
);

ALTER TABLE public.group_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_predictions ENABLE ROW LEVEL SECURITY;

-- Everyone can read group_teams
CREATE POLICY "Anyone can read group_teams"
  ON public.group_teams FOR SELECT
  USING (true);

-- Users can read/insert/update/delete own group_predictions
CREATE POLICY "Users can read own group_predictions"
  ON public.group_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own group_predictions"
  ON public.group_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own group_predictions"
  ON public.group_predictions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own group_predictions"
  ON public.group_predictions FOR DELETE
  USING (auth.uid() = user_id);
