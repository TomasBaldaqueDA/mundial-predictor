-- Squads use names + positions only (no headshot images).
UPDATE public.five_a_side_players SET photo_url = NULL WHERE photo_url IS NOT NULL;
