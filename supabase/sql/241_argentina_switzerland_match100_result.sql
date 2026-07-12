-- Match 100 (FIFA M100): Argentina 1-1 Switzerland, AET 3-1 (Quarter-final, 12 Jul 2026 — W95 vs W96)
-- 90': Mac Allister 10' (assist Messi) | Ndoye 67' (assist Rodriguez)
-- AET: Alvarez 112' (assist Lopez) | L. Martinez 120+1'
-- MVP: Julian Alvarez
-- Games score = 90' (1-1); qualifier = Argentina. Five-a-side goals/assists include ET; no wins (draw at 90').
-- Argentina advances to Semi-final (match 102 team2 = W100)
-- Lineups: SofaScore (Jul 12 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Julian Alvarez',
  qualifier = 'Argentina'
WHERE id = 100;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Alexis Mac Allister';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Dan Ndoye';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Julian Alvarez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lautaro Martinez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Ricardo Rodriguez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Jose Manuel Lopez';

UPDATE public.matches SET team2 = 'Argentina'
WHERE id = 102 AND stage = 'Semi-final';

SELECT public.add_match_appearances(100, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Nicolas Tagliafico', 'Lisandro Martinez', 'Cristian Romero', 'Nahuel Molina',
  'Leandro Paredes', 'Alexis Mac Allister', 'Enzo Fernandez', 'Rodrigo De Paul', 'Julian Alvarez', 'Lionel Messi',
  'Nicolas Gonzalez', 'Gonzalo Montiel', 'Lautaro Martinez', 'Thiago Almada', 'Nicolas Otamendi', 'Jose Manuel Lopez'
]);

SELECT public.add_match_appearances(100, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Denis Zakaria', 'Nico Elvedi', 'Manuel Akanji', 'Ricardo Rodriguez',
  'Djibril Sow', 'Remo Freuler', 'Fabian Rieder', 'Granit Xhaka', 'Dan Ndoye', 'Breel Embolo',
  'Miro Muheim', 'Silvan Widmer', 'Zeki Amdouni', 'Eray Cömert', 'Ardon Jashari', 'Ruben Vargas'
]);

SELECT public.refresh_five_a_side_player_stats();
