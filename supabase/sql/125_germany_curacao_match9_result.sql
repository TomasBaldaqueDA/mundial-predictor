-- Match 9: Germany 7-1 Curaçao (Group E, 14 Jun 2026)
-- Goals: Nmecha 6', Comenencia 21', Schlotterbeck 38', Havertz 45'+5 pen & 88',
--        Musiala 47', Brown 68', Undav 78'
-- Assists: Wirtz, Brown, Nmecha, Kimmich (x2), Undav (x2)
-- MVP: Kai Havertz

UPDATE public.matches
SET
  status = 'finished',
  score1 = 7,
  score2 = 1,
  mvp    = 'Kai Havertz'
WHERE id = 9;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Felix Nmecha';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Curaçao' AND name = 'Livano Comenencia';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Nico Schlotterbeck';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Germany' AND name = 'Kai Havertz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Jamal Musiala';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Nathaniel Brown';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Deniz Undav';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Florian Wirtz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Nathaniel Brown';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Felix Nmecha';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Germany' AND name = 'Joshua Kimmich';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Germany' AND name = 'Deniz Undav';

SELECT public.add_match_appearances(9, 'Germany', ARRAY[
  'Manuel Neuer', 'Joshua Kimmich', 'Jonathan Tah', 'Nico Schlotterbeck', 'Nathaniel Brown',
  'Aleksandar Pavlovic', 'Felix Nmecha', 'Leroy Sané', 'Jamal Musiala', 'Florian Wirtz', 'Kai Havertz',
  'Deniz Undav', 'David Raum', 'Antonio Rüdiger', 'Leon Goretzka', 'Waldemar Anton'
]);

SELECT public.add_match_appearances(9, 'Curaçao', ARRAY[
  'Eloy Room', 'Sherel Floranus', 'Riechedly Bazoer', 'Armando Obispo', 'Deveron Fonville',
  'Tahith Chong', 'Leandro Bacuna', 'Sontje Hansen', 'Livano Comenencia', 'Juninho Bacuna', 'Jurgen Locadia',
  'Jeremy Antonisse', 'Jearl Margaritha', 'Gervane Kastaneer'
]);

SELECT public.refresh_five_a_side_player_stats();
