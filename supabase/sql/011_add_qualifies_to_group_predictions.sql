-- qualifies: true = team passes to next round (1st/2nd always; 3rd only 8 of 12)
ALTER TABLE public.group_predictions
  ADD COLUMN IF NOT EXISTS qualifies boolean DEFAULT false;
