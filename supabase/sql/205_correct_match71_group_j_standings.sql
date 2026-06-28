-- Correct match 71 (was erroneously applied as 2-1) and Group J runner-up slot.
-- Final: Algeria 3-3 Austria | 1 Argentina | 2 Austria | 3 Algeria | 4 Jordan

UPDATE public.matches
SET score1 = 3, score2 = 3
WHERE id = 71;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Algeria' AND name = 'Rafik Belghali';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Marcel Sabitzer';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Sasa Kalajdzic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'Konrad Laimer';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'Michael Gregoritsch';

UPDATE public.group_actual_standings SET team_name = 'Austria'
WHERE group_code = 'J' AND position = 2;

UPDATE public.group_actual_standings SET team_name = 'Algeria'
WHERE group_code = 'J' AND position = 3;

UPDATE public.matches SET team2 = 'Austria'
WHERE id = 83 AND stage = 'Round of 32';

SELECT public.refresh_five_a_side_player_stats();
