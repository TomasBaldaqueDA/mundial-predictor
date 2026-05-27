-- 5-A-SIDE power-ups: captain (×2 points, immutable) and one supersub between groups and R32.

ALTER TABLE public.five_a_side_picks
  ADD COLUMN IF NOT EXISTS captain_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS captain_set_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS supersub_slot text NULL CHECK (supersub_slot IS NULL OR supersub_slot IN ('gk', 'df', 'md1', 'md2', 'st')),
  ADD COLUMN IF NOT EXISTS supersub_out_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supersub_in_player_id uuid REFERENCES public.five_a_side_players(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supersub_applied_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS supersub_out_stats jsonb NULL,
  ADD COLUMN IF NOT EXISTS supersub_in_baseline jsonb NULL;

COMMENT ON COLUMN public.five_a_side_picks.captain_player_id IS 'One of the five lineup players; their fantasy points count double for the whole tournament.';
COMMENT ON COLUMN public.five_a_side_picks.supersub_out_stats IS 'Snapshot of outgoing player stats when supersub is applied.';
COMMENT ON COLUMN public.five_a_side_picks.supersub_in_baseline IS 'Incoming player stats at supersub time; only the delta counts after that.';

CREATE OR REPLACE FUNCTION public.validate_five_a_side_powerups()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  lineup uuid[] := ARRAY[
    NEW.gk_player_id,
    NEW.df_player_id,
    NEW.md1_player_id,
    NEW.md2_player_id,
    NEW.st_player_id
  ];
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.captain_set_at IS NOT NULL
       AND NEW.captain_player_id IS DISTINCT FROM OLD.captain_player_id THEN
      RAISE EXCEPTION 'Captain cannot be changed once set';
    END IF;

    IF OLD.supersub_applied_at IS NOT NULL THEN
      IF NEW.supersub_slot IS DISTINCT FROM OLD.supersub_slot
         OR NEW.supersub_out_player_id IS DISTINCT FROM OLD.supersub_out_player_id
         OR NEW.supersub_in_player_id IS DISTINCT FROM OLD.supersub_in_player_id
         OR NEW.supersub_applied_at IS DISTINCT FROM OLD.supersub_applied_at
         OR NEW.supersub_out_stats IS DISTINCT FROM OLD.supersub_out_stats
         OR NEW.supersub_in_baseline IS DISTINCT FROM OLD.supersub_in_baseline THEN
        RAISE EXCEPTION 'Supersub cannot be changed once applied';
      END IF;
    END IF;
  END IF;

  IF NEW.captain_player_id IS NOT NULL THEN
    IF NOT (NEW.captain_player_id = ANY (lineup)) THEN
      RAISE EXCEPTION 'Captain must be one of the five lineup players';
    END IF;
    IF NEW.captain_set_at IS NULL THEN
      NEW.captain_set_at := now();
    END IF;
  END IF;

  IF NEW.supersub_applied_at IS NOT NULL THEN
    IF NEW.supersub_slot IS NULL
       OR NEW.supersub_out_player_id IS NULL
       OR NEW.supersub_in_player_id IS NULL
       OR NEW.supersub_out_stats IS NULL
       OR NEW.supersub_in_baseline IS NULL THEN
      RAISE EXCEPTION 'Supersub requires slot, players and stat snapshots';
    END IF;

    CASE NEW.supersub_slot
      WHEN 'gk' THEN
        IF NEW.gk_player_id IS DISTINCT FROM NEW.supersub_in_player_id THEN
          RAISE EXCEPTION 'Supersub in player must occupy the replaced slot';
        END IF;
      WHEN 'df' THEN
        IF NEW.df_player_id IS DISTINCT FROM NEW.supersub_in_player_id THEN
          RAISE EXCEPTION 'Supersub in player must occupy the replaced slot';
        END IF;
      WHEN 'md1' THEN
        IF NEW.md1_player_id IS DISTINCT FROM NEW.supersub_in_player_id THEN
          RAISE EXCEPTION 'Supersub in player must occupy the replaced slot';
        END IF;
      WHEN 'md2' THEN
        IF NEW.md2_player_id IS DISTINCT FROM NEW.supersub_in_player_id THEN
          RAISE EXCEPTION 'Supersub in player must occupy the replaced slot';
        END IF;
      WHEN 'st' THEN
        IF NEW.st_player_id IS DISTINCT FROM NEW.supersub_in_player_id THEN
          RAISE EXCEPTION 'Supersub in player must occupy the replaced slot';
        END IF;
      ELSE
        RAISE EXCEPTION 'Invalid supersub slot';
    END CASE;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_five_a_side_powerups ON public.five_a_side_picks;
CREATE TRIGGER trg_validate_five_a_side_powerups
  BEFORE INSERT OR UPDATE ON public.five_a_side_picks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_five_a_side_powerups();
