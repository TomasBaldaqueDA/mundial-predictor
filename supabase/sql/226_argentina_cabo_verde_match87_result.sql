-- Match 87 (FIFA M86): Argentina 1-1 Cabo Verde, AET 3-2 (Round of 32, 3 Jul 2026 — 1J vs 2H)
-- 90': Messi 29' (assist L. Martínez) | Deroy Duarte 59' (assist R. Mendes)
-- AET: L. Martínez 92' (assist Mac Allister) | S. Cabral 103' (assist Y. Semedo) | Diney 111' (OG)
-- MVP: Lionel Messi
-- Games score = 90' (1-1); qualifier = Argentina. Five-a-side goals/assists include ET; no wins (draw at 90').
-- Argentina advances to Round of 16 (match 95 team1 = W86)
-- Lineups: SofaScore (Jul 3 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Lionel Messi',
  qualifier = 'Argentina'
WHERE id = 87;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Cabo Verde' AND name = 'Deroy Duarte';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lisandro Martinez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Cabo Verde' AND name = 'Sidny Cabral';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Cabo Verde' AND name = 'Diney Borges';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Lisandro Martinez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Cabo Verde' AND name = 'Ryan Mendes';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Alexis Mac Allister';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Cabo Verde' AND name = 'Yannick Semedo';

UPDATE public.matches SET team1 = 'Argentina'
WHERE id = 95 AND stage = 'Round of 16';

SELECT public.add_match_appearances(87, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Facundo Medina', 'Cristian Romero', 'Lisandro Martinez', 'Nahuel Molina',
  'Rodrigo De Paul', 'Enzo Fernandez', 'Alexis Mac Allister', 'Thiago Almada', 'Lionel Messi', 'Lautaro Martinez',
  'Julian Alvarez', 'Nicolas Gonzalez', 'Leandro Paredes', 'Nicolas Tagliafico', 'Gonzalo Montiel'
]);

SELECT public.add_match_appearances(87, 'Cabo Verde', ARRAY[
  'Vozinha', 'Ryan Mendes', 'Steven Moreira', 'Laros Duarte', 'Roberto Lopes', 'Diney Borges',
  'Deroy Duarte', 'Jovane Cabral', 'Nuno Da Costa', 'Sidny Cabral', 'Kevin Pina',
  'Jamiro Monteiro', 'Dailon Livramento', 'Willy Semedo', 'Helio Varela', 'Yannick Semedo', 'Ianique Dos Santos Tavares'
]);

SELECT public.refresh_five_a_side_player_stats();
