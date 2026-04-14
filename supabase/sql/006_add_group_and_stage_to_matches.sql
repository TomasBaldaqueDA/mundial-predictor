-- Add group and stage metadata to matches
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS "group" text,
  ADD COLUMN IF NOT EXISTS stage text;

