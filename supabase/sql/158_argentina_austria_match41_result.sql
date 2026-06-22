-- Match 41: Argentina 2-0 Austria (Group J, 22 Jun 2026)
-- Goals: Messi 38' (assist Medina), 90+5'
-- MVP: Lionel Messi
-- Lineups: SofaScore (Jun 22 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp    = 'Lionel Messi'
WHERE id = 41;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Facundo Medina';

SELECT public.add_match_appearances(41, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Nicolas Tagliafico', 'Nicolas Otamendi', 'Lisandro Martinez', 'Nahuel Molina',
  'Leandro Paredes', 'Alexis Mac Allister', 'Enzo Fernandez', 'Nicolas Gonzalez', 'Julian Alvarez', 'Lionel Messi',
  'Cristian Romero', 'Thiago Almada', 'Lautaro Martinez', 'Rodrigo De Paul', 'Facundo Medina'
]);

SELECT public.add_match_appearances(41, 'Austria', ARRAY[
  'Alexander Schlager', 'Konrad Laimer', 'David Alaba', 'Kevin Danso', 'Stefan Posch',
  'Xaver Schlager', 'Nicolas Seiwald', 'Marcel Sabitzer', 'Paul Wanner', 'Romano Schmid', 'Michael Gregoritsch',
  'Marco Friedl', 'Alexander Prass', 'Marko Arnautovic', 'Patrick Wimmer', 'Carney Chukwuemeka'
]);

SELECT public.refresh_five_a_side_player_stats();
