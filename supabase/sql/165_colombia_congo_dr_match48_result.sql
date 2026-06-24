-- Match 48: Colombia 1-0 Congo DR (Group K, 24 Jun 2026)
-- Goal: Munoz 76' (assist Quintero)
-- MVP: Daniel Munoz
-- Lineups: SofaScore (Jun 24 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp    = 'Daniel Munoz'
WHERE id = 48;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Colombia' AND name = 'Daniel Munoz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Colombia' AND name = 'Juan Fernando Quintero';

SELECT public.add_match_appearances(48, 'Colombia', ARRAY[
  'Camilo Vargas', 'Johan Mojica', 'Jhon Lucumi', 'Davinson Sanchez', 'Daniel Munoz',
  'Jhon Arias', 'Jefferson Lerma', 'Gustavo Puerta', 'Luis Diaz', 'Luis Suarez', 'James Rodriguez',
  'Juan Fernando Quintero', 'Jhon Cordoba', 'Richard Rios'
]);

SELECT public.add_match_appearances(48, 'Congo DR', ARRAY[
  'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Chancel Mbemba', 'Alex Tuanzebe', 'Steve Kapuadi', 'Arthur Masuaku',
  'Ngal''ayel Mukau', 'Samuel Moutoussamy', 'Edo Kayembe', 'Cedric Bakambu', 'Yoane Wissa',
  'Noah Sadiki', 'Simon Banza', 'Joris Kayembe', 'Charles Pickel', 'Nathanael Mbuku'
]);

SELECT public.refresh_five_a_side_player_stats();
