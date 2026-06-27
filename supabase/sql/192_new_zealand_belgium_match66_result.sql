-- Match 66: New Zealand 1-5 Belgium (Group G, 27 Jun 2026)
-- Goals: Trossard 28', 50' (assist Vanaken) | De Bruyne 66' | Just 84'
--        Lukaku 86' (assist Raskin) | Saelemaekers 90+4 (assist Lukaku)
-- MVP: Leandro Trossard
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 5,
  mvp    = 'Leandro Trossard'
WHERE id = 66;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Leandro Trossard';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Leandro Trossard';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Kevin De Bruyne';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'New Zealand' AND name = 'Eli Just';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Romelu Lukaku';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Alexis Saelemaekers';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Hans Vanaken';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Nicolas Raskin';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Romelu Lukaku';

SELECT public.add_match_appearances(66, 'New Zealand', ARRAY[
  'Max Crocombe', 'Tim Payne', 'Finn Surman', 'Tyler Bindon', 'Liberato Cacace',
  'Joe Bell', 'Marko Stamenic', 'Sarpreet Singh', 'Ryan Thomas', 'Eli Just', 'Chris Wood',
  'Ben Old', 'Jesse Randall', 'Michael Boxall', 'Callum McCowatt', 'Francis de Vries'
]);

SELECT public.add_match_appearances(66, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Timothy Castagne', 'Brandon Mechele', 'Arthur Theate', 'Maxim De Cuyper',
  'Youri Tielemans', 'Hans Vanaken', 'Jeremy Doku', 'Kevin De Bruyne', 'Leandro Trossard', 'Charles De Ketelaere',
  'Matias Fernandez-Pardo', 'Alexis Saelemaekers', 'Amadou Onana', 'Romelu Lukaku', 'Nicolas Raskin'
]);

SELECT public.refresh_five_a_side_player_stats();
