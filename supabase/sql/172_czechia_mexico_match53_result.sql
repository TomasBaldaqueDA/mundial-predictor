-- Match 53: Czechia 0-3 Mexico (Group A, 25 Jun 2026)
-- Goals: Chavez 55' (assist Romo) | Quinones 61' (assist Sanchez) | Fidalgo 90+4 (assist Alvarado)
-- MVP: Mateo Chavez
-- Lineups: SofaScore (Jun 25 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 3,
  mvp    = 'Mateo Chavez'
WHERE id = 53;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Mateo Chavez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Julian Quinones';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Alvaro Fidalgo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Luis Romo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Jorge Sanchez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Roberto Alvarado';

SELECT public.add_match_appearances(53, 'Czechia', ARRAY[
  'Matej Kovar', 'Ladislav Krejci', 'Robin Hranac', 'Tomas Holes', 'David Doudera',
  'Michal Sadilek', 'Lukas Cerv', 'Vladimir Coufal', 'Denis Visinsky', 'Pavel Sulc', 'Adam Hlozek',
  'Lukas Provod', 'Tomas Soucek', 'Patrik Schick', 'Tomas Chory', 'Alexandr Sojka'
]);

SELECT public.add_match_appearances(53, 'Mexico', ARRAY[
  'Raul Rangel', 'Jorge Sanchez', 'Cesar Montes', 'Israel Reyes', 'Mateo Chavez',
  'Gilberto Mora', 'Edson Alvarez', 'Luis Romo', 'Roberto Alvarado', 'Guillermo Martinez', 'Julian Quinones',
  'Obed Vargas', 'Santiago Gimenez', 'Alvaro Fidalgo', 'Guillermo Ochoa', 'Jesus Gallardo'
]);

SELECT public.refresh_five_a_side_player_stats();
