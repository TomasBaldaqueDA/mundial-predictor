-- Match 34: Germany 2-1 Côte d'Ivoire (Group E, 20 Jun 2026)
-- Goals: Kessie 30' | Undav 68' (assist Amiri), 90+4 (assist Nmecha)
-- MVP: Deniz Undav
-- Lineups: SofaScore (Jun 20 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Deniz Undav'
WHERE id = 34;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Deniz Undav';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Deniz Undav';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Franck Kessie';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Nadiem Amiri';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Felix Nmecha';

SELECT public.add_match_appearances(34, 'Germany', ARRAY[
  'Manuel Neuer', 'Nathaniel Brown', 'Nico Schlotterbeck', 'Jonathan Tah', 'Joshua Kimmich',
  'Aleksandar Pavlovic', 'Felix Nmecha', 'Florian Wirtz', 'Jamal Musiala', 'Leroy Sané', 'Kai Havertz',
  'Antonio Rüdiger', 'Nadiem Amiri', 'Deniz Undav', 'Jamie Leweling', 'Leon Goretzka'
]);

SELECT public.add_match_appearances(34, 'Côte d''Ivoire', ARRAY[
  'Yahia Fofana', 'Wilfried Singo', 'Odilon Kossounou', 'Emmanuel Agbadou', 'Ghislain Konan',
  'Franck Kessie', 'Seko Fofana', 'Christ Inao Oulai', 'Nicolas Pepe', 'Simon Adingra', 'Evann Guessand',
  'Ibrahim Sangare', 'Amad Diallo', 'Ange-Yoan Bonny', 'Guela Doué', 'Yan Diomande'
]);

SELECT public.refresh_five_a_side_player_stats();
