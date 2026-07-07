-- Match 93 (FIFA M93): Portugal 0-1 Spain (Round of 16, 6 Jul 2026 — W83 vs W84)
-- Goal: Merino 90+1' (assist Ferran Torres)
-- MVP: Rodri
-- Spain advances to Quarter-final (match 98 team1 = W93)
-- Lineups: SofaScore (Jul 6 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp       = 'Rodri',
  qualifier = 'Spain'
WHERE id = 93;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Merino';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Ferran Torres';

UPDATE public.matches SET team1 = 'Spain'
WHERE id = 98 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(93, 'Portugal', ARRAY[
  'Diogo Costa', 'Joao Cancelo', 'Ruben Dias', 'Renato Veiga', 'Nuno Mendes',
  'Vitinha', 'Joao Neves', 'Pedro Neto', 'Bruno Fernandes', 'Joao Felix', 'Cristiano Ronaldo',
  'Nelson Semedo', 'Diogo Dalot', 'Rafael Leao', 'Bernardo Silva', 'Francisco Conceicao'
]);

SELECT public.add_match_appearances(93, 'Spain', ARRAY[
  'Unai Simón', 'Marc Cucurella', 'Aymeric Laporte', 'Pau Cubarsí', 'Pedro Porro',
  'Pedri', 'Rodri', 'Álex Baena', 'Dani Olmo', 'Lamine Yamal', 'Mikel Oyarzabal',
  'Ferran Torres', 'Fabián Ruiz', 'Mikel Merino', 'Borja Iglesias'
]);

SELECT public.refresh_five_a_side_player_stats();
