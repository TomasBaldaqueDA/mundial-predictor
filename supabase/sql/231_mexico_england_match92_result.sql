-- Match 92 (FIFA M92): Mexico 2-3 England (Round of 16, 6 Jul 2026 — W79 vs W80)
-- Goals: Bellingham 36', 38' (assists Saka, Kane); Quinones 42'; Kane 60' (pen); Jimenez 69' (pen)
-- MVP: Jude Bellingham
-- England advances to Quarter-final (match 99 team2 = W92)
-- Lineups: SofaScore (Jul 6 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 3,
  mvp       = 'Jude Bellingham',
  qualifier = 'England'
WHERE id = 92;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Julian Quinones';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Raul Jimenez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Bukayo Saka';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.matches SET team2 = 'England'
WHERE id = 99 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(92, 'Mexico', ARRAY[
  'Raul Rangel', 'Jesus Gallardo', 'Johan Vasquez', 'Cesar Montes', 'Jorge Sanchez',
  'Luis Romo', 'Erik Lira', 'Gilberto Mora', 'Julian Quinones', 'Raul Jimenez', 'Roberto Alvarado',
  'Edson Alvarez', 'Brian Gutierrez', 'Santiago Gimenez', 'Alvaro Fidalgo', 'Guillermo Martinez'
]);

SELECT public.add_match_appearances(92, 'England', ARRAY[
  'Jordan Pickford', 'Jarell Quansah', 'Ezri Konsa', 'Marc Guehi', 'Nico O''Reilly',
  'Declan Rice', 'Elliott Anderson', 'Bukayo Saka', 'Jude Bellingham', 'Anthony Gordon', 'Harry Kane',
  'John Stones', 'Djed Spence', 'Dan Burn', 'Morgan Rogers'
]);

SELECT public.refresh_five_a_side_player_stats();
