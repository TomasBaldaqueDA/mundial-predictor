-- Match 64: Uruguay 0-1 Spain (Group H, 27 Jun 2026)
-- Goal: Baena 42' (assist Llorente)
-- MVP: Álex Baena
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'Álex Baena'
WHERE id = 64;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Álex Baena';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Marcos Llorente';

SELECT public.add_match_appearances(64, 'Uruguay', ARRAY[
  'Fernando Muslera', 'Mathias Olivera', 'Maxi Araujo', 'Sebastian Caceres', 'Guillermo Varela',
  'Manuel Ugarte', 'Rodrigo Bentancur', 'Agustin Canobbio', 'Federico Valverde', 'Juan Manuel Sanabria', 'Darwin Nunez',
  'Nicolas de la Cruz', 'Sergio Rochet', 'Federico Vinas', 'Brian Rodriguez'
]);

SELECT public.add_match_appearances(64, 'Spain', ARRAY[
  'Unai Simón', 'Marcos Llorente', 'Aymeric Laporte', 'Pau Cubarsí', 'Marc Cucurella',
  'Rodri', 'Pedri', 'Álex Baena', 'Mikel Merino', 'Lamine Yamal', 'Mikel Oyarzabal',
  'Fabián Ruiz', 'Dani Olmo', 'Yéremy Pino', 'Nico Williams', 'Ferran Torres'
]);

SELECT public.refresh_five_a_side_player_stats();
