-- Match 69: Colombia 0-0 Portugal (Group K, 28 Jun 2026)
-- MVP: Diogo Costa
-- Lineups: SofaScore (Jun 28 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Diogo Costa'
WHERE id = 69;

SELECT public.add_match_appearances(69, 'Colombia', ARRAY[
  'Camilo Vargas', 'Deiver Machado', 'Jhon Lucumi', 'Davinson Sanchez', 'Santiago Arias',
  'Gustavo Puerta', 'Jefferson Lerma', 'Jhon Arias', 'Luis Diaz', 'Jhon Cordoba', 'James Rodriguez',
  'Richard Rios', 'Luis Suarez', 'Juan Fernando Quintero', 'Kevin Castano', 'Daniel Munoz'
]);

SELECT public.add_match_appearances(69, 'Portugal', ARRAY[
  'Diogo Costa', 'Joao Cancelo', 'Ruben Dias', 'Renato Veiga', 'Nuno Mendes',
  'Ruben Neves', 'Vitinha', 'Pedro Neto', 'Bruno Fernandes', 'Joao Felix', 'Cristiano Ronaldo',
  'Diogo Dalot', 'Joao Neves', 'Samuel Costa', 'Rafael Leao', 'Matheus Nunes'
]);

SELECT public.refresh_five_a_side_player_stats();
