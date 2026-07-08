-- Match 96 (FIFA M96): Switzerland 0-0 Colombia, PSO 4-3 (Round of 16, 7 Jul 2026 — W85 vs W87)
-- MVP: Gregor Kobel
-- Games score = 90' (0-0); qualifier = Switzerland. No goals at 90'; no wins (draw at 90').
-- Switzerland advances to Quarter-final (match 100 team2 = W96)
-- Lineups: SofaScore (Jul 7 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp       = 'Gregor Kobel',
  qualifier = 'Switzerland'
WHERE id = 96;

UPDATE public.matches SET team2 = 'Switzerland'
WHERE id = 100 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(96, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Ricardo Rodriguez', 'Manuel Akanji', 'Nico Elvedi', 'Denis Zakaria',
  'Granit Xhaka', 'Remo Freuler', 'Dan Ndoye', 'Ardon Jashari', 'Fabian Rieder', 'Breel Embolo',
  'Djibril Sow', 'Miro Muheim', 'Silvan Widmer', 'Cedric Itten', 'Ruben Vargas', 'Zeki Amdouni'
]);

SELECT public.add_match_appearances(96, 'Colombia', ARRAY[
  'Camilo Vargas', 'Johan Mojica', 'Jhon Lucumi', 'Davinson Sanchez', 'Daniel Munoz',
  'Luis Diaz', 'Gustavo Puerta', 'Jefferson Lerma', 'Jhon Arias', 'James Rodriguez', 'Luis Suarez',
  'Juan Fernando Quintero', 'Jaminton Campaz', 'Richard Rios', 'Juan Camilo Hernandez', 'Yerry Mina'
]);

SELECT public.refresh_five_a_side_player_stats();
