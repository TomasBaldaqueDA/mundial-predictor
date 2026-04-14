-- Ensure display_name is unique across all profiles (case-insensitive).
-- NOTE: If this migration fails due to existing duplicates, fix them manually
-- (choose distinct names) and rerun.

ALTER TABLE public.profiles
  ALTER COLUMN display_name SET NOT NULL,
  ALTER COLUMN display_name SET DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS profiles_display_name_unique
  ON public.profiles (lower(display_name));

