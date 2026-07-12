-- Fix match 67: Kane 67' (assist Bellingham) was wrongly stored as Bellingham goal + Kane assist.
UPDATE public.five_a_side_players SET goals = goals - 1
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET assists = assists - 1
WHERE team = 'England' AND name = 'Harry Kane';

SELECT public.refresh_five_a_side_player_stats();
