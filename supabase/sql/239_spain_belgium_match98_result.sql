-- Match 98 (FIFA M98): Spain 2-1 Belgium (Quarter-final, 10 Jul 2026 — W93 vs W94)
-- Goals: Fabián Ruiz 30'; De Ketelaere 41' (assist Castagne); Merino 88'
-- MVP: Lamine Yamal
-- Spain advances to Semi-final (match 101 team2 = W98)
-- Lineups: SofaScore (Jul 10 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp       = 'Lamine Yamal',
  qualifier = 'Spain'
WHERE id = 98;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Fabián Ruiz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Charles De Ketelaere';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Merino';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Timothy Castagne';

UPDATE public.matches SET team2 = 'Spain'
WHERE id = 101 AND stage = 'Semi-final';

SELECT public.add_match_appearances(98, 'Spain', ARRAY[
  'Unai Simón', 'Marc Cucurella', 'Aymeric Laporte', 'Pau Cubarsí', 'Pedro Porro',
  'Fabián Ruiz', 'Rodri', 'Álex Baena', 'Dani Olmo', 'Lamine Yamal', 'Mikel Oyarzabal',
  'Pedri', 'Ferran Torres', 'Nico Williams', 'Mikel Merino'
]);

SELECT public.add_match_appearances(98, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Timothy Castagne', 'Nathan Ngoy', 'Brandon Mechele', 'Maxim De Cuyper',
  'Hans Vanaken', 'Nicolas Raskin', 'Leandro Trossard', 'Kevin De Bruyne', 'Jeremy Doku', 'Charles De Ketelaere',
  'Axel Witsel', 'Romelu Lukaku', 'Joaquin Seys', 'Senne Lammens', 'Alexis Saelemaekers'
]);

SELECT public.refresh_five_a_side_player_stats();
