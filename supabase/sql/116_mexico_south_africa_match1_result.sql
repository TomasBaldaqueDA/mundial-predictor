-- Match 1: Mexico 2-0 South Africa (Group A opener, 11 Jun 2026)
-- Goals: Julian Quinones 9', Raul Jimenez 67'
-- Assists: Erik Lira (Quiñones), Roberto Alvarado (Jiménez)
-- MVP: Julian Quinones

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp    = 'Julian Quinones'
WHERE id = 1;

-- 5-A-SIDE: goals and assists are maintained manually per match
UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Julian Quinones';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Raul Jimenez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Erik Lira';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Roberto Alvarado';

-- MVP / wins / clean sheets derived from finished matches
SELECT public.refresh_five_a_side_player_stats();
