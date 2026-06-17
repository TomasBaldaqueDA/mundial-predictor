-- Match 21: Portugal 1-1 Congo DR (Group K, 17 Jun 2026)
-- Goals: Neves 6' (assist Neto) | Wissa 45+5' (assist Masuaku)
-- MVP: Joao Neves
-- Lineups: SofaScore (Jun 17 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Joao Neves'
WHERE id = 21;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Portugal' AND name = 'Joao Neves';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Congo DR' AND name = 'Yoane Wissa';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Portugal' AND name = 'Pedro Neto';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Congo DR' AND name = 'Arthur Masuaku';

SELECT public.add_match_appearances(21, 'Portugal', ARRAY[
  'Diogo Costa', 'Nuno Mendes', 'Renato Veiga', 'Tomas Araujo', 'Joao Cancelo',
  'Vitinha', 'Joao Neves', 'Pedro Neto', 'Bruno Fernandes', 'Bernardo Silva', 'Cristiano Ronaldo',
  'Francisco Conceicao', 'Rafael Leao', 'Nelson Semedo', 'Goncalo Ramos'
]);

SELECT public.add_match_appearances(21, 'Congo DR', ARRAY[
  'Lionel Mpasi', 'Arthur Masuaku', 'Steve Kapuadi', 'Alex Tuanzebe', 'Chancel Mbemba', 'Aaron Wan-Bissaka',
  'Edo Kayembe', 'Samuel Moutoussamy', 'Ngal''ayel Mukau', 'Cedric Bakambu', 'Yoane Wissa',
  'Noah Sadiki', 'Joris Kayembe', 'Charles Pickel', 'Gédéon Kalulu', 'Simon Banza'
]);

SELECT public.refresh_five_a_side_player_stats();
