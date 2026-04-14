-- Run this after deleting/editing matches to sync five_a_side_players stats (mvp, wins, clean_sheets).
-- Goals and assists are not recalculated from matches; only mvp, wins, clean_sheets come from matches.
SELECT public.refresh_five_a_side_player_stats();
