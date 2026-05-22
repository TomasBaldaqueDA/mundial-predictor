-- Optional headshot for 5-A-SIDE cards and pickers. Use a public HTTPS URL or a
-- site-relative path served by Next.js (e.g. /imgs_cartoons/Brazil/Player Name.jpg).
ALTER TABLE public.five_a_side_players
  ADD COLUMN IF NOT EXISTS photo_url text NULL;

COMMENT ON COLUMN public.five_a_side_players.photo_url IS
  'Public or same-origin image URL for UI; NULL = kit-only placeholder.';
