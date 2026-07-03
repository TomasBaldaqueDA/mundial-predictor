-- Match 84 (FIFA M83): Portugal 2-1 Croatia (Round of 32, 3 Jul 2026 — 2K vs 2L)
-- Goals: Perisic 53' | Ronaldo 68' (pen) | Ramos 90+4' (assist Leao)
-- MVP: Cristiano Ronaldo
-- Portugal advances to Round of 16 (match 93 team1 = W83)
-- Lineups: SofaScore (Jul 3 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp       = 'Cristiano Ronaldo',
  qualifier = 'Portugal'
WHERE id = 84;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Ivan Perisic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Portugal' AND name = 'Cristiano Ronaldo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Portugal' AND name = 'Goncalo Ramos';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Portugal' AND name = 'Rafael Leao';

UPDATE public.matches SET team1 = 'Portugal'
WHERE id = 93 AND stage = 'Round of 16';

SELECT public.add_match_appearances(84, 'Portugal', ARRAY[
  'Diogo Costa', 'Nuno Mendes', 'Renato Veiga', 'Ruben Dias', 'Joao Cancelo',
  'Vitinha', 'Joao Neves', 'Rafael Leao', 'Bruno Fernandes', 'Pedro Neto', 'Cristiano Ronaldo',
  'Bernardo Silva', 'Francisco Conceicao', 'Nelson Semedo', 'Goncalo Ramos', 'Ruben Neves'
]);

SELECT public.add_match_appearances(84, 'Croatia', ARRAY[
  'Dominik Livakovic', 'Josip Stanisic', 'Josip Sutalo', 'Marin Pongracic', 'Ivan Perisic',
  'Nikola Vlasic', 'Petar Sucic', 'Luka Modric', 'Martin Baturina', 'Ante Budimir',
  'Igor Matanovic', 'Mario Pasalic', 'Josko Gvardiol', 'Andrej Kramaric', 'Mateo Kovacic'
]);

SELECT public.refresh_five_a_side_player_stats();
