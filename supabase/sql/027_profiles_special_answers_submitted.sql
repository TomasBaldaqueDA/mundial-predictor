-- When user clicks "Save answers" we set this; on load we show answers locked if set.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS special_answers_submitted_at timestamptz NULL;

COMMENT ON COLUMN public.profiles.special_answers_submitted_at IS 'Set when user clicks Save answers on special questions; used to show answers locked on next visit.';
