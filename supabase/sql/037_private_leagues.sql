-- Private leagues: create, invite code, members. Join via RPC only (validates code).

CREATE TABLE IF NOT EXISTS public.private_leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text NOT NULL UNIQUE DEFAULT upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8)),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.private_league_members (
  league_id uuid NOT NULL REFERENCES public.private_leagues (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (league_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_private_league_members_user ON public.private_league_members (user_id);

ALTER TABLE public.private_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_league_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "private_leagues_select_members"
  ON public.private_leagues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.private_league_members m
      WHERE m.league_id = private_leagues.id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "private_leagues_insert_owner"
  ON public.private_leagues FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "private_leagues_update_owner"
  ON public.private_leagues FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "private_leagues_delete_owner"
  ON public.private_leagues FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "private_league_members_select"
  ON public.private_league_members FOR SELECT
  USING (
    league_id IN (
      SELECT league_id FROM public.private_league_members WHERE user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.private_league_add_owner_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.private_league_members (league_id, user_id)
  VALUES (NEW.id, NEW.owner_id)
  ON CONFLICT (league_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_private_league_owner_member ON public.private_leagues;
CREATE TRIGGER tr_private_league_owner_member
  AFTER INSERT ON public.private_leagues
  FOR EACH ROW
  EXECUTE FUNCTION public.private_league_add_owner_member();

CREATE OR REPLACE FUNCTION public.join_private_league(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lid uuid;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  SELECT id INTO lid
  FROM public.private_leagues
  WHERE invite_code = upper(trim(p_code))
  LIMIT 1;
  IF lid IS NULL THEN
    RAISE EXCEPTION 'invalid invite code';
  END IF;
  INSERT INTO public.private_league_members (league_id, user_id)
  VALUES (lid, uid)
  ON CONFLICT (league_id, user_id) DO NOTHING;
  RETURN lid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_private_league(text) TO authenticated;
