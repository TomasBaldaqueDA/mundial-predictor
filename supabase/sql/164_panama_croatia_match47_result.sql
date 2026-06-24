-- Match 47: Panama 0-1 Croatia (Group L, 24 Jun 2026)
-- Goal: Budimir 54' (assist Stanisic)
-- MVP: Cristian Martinez
-- Lineups: SofaScore (Jun 24 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'Cristian Martinez'
WHERE id = 47;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Ante Budimir';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Croatia' AND name = 'Josip Stanisic';

SELECT public.add_match_appearances(47, 'Panama', ARRAY[
  'Orlando Mosquera', 'Cesar Blackman', 'Andres Andrade', 'Jose Cordoba', 'Jiovany Ramos',
  'Amir Murillo', 'Jose Luis Rodriguez', 'Yoel Barcenas', 'Carlos Harvey', 'Cristian Martinez', 'Jose Fajardo',
  'Cecilio Waterman', 'Azarias Londono', 'Eric Davis', 'Tomas Rodriguez'
]);

SELECT public.add_match_appearances(47, 'Croatia', ARRAY[
  'Dominik Livakovic', 'Josip Stanisic', 'Josip Sutalo', 'Marin Pongracic', 'Josko Gvardiol',
  'Mario Pasalic', 'Luka Modric', 'Martin Baturina', 'Mateo Kovacic', 'Ivan Perisic', 'Petar Musa',
  'Ante Budimir', 'Andrej Kramaric', 'Luka Sucic', 'Petar Sucic'
]);

SELECT public.refresh_five_a_side_player_stats();
