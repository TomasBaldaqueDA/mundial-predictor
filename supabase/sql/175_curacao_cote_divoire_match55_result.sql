-- Match 55: Curaçao 0-2 Côte d'Ivoire (Group E, 25 Jun 2026)
-- Goals: Pepe 7' (assist Yan Diomande) | Pepe 64' (assist Sangare)
-- MVP: Nicolas Pepe
-- Lineups: SofaScore (Jun 25 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 2,
  mvp    = 'Nicolas Pepe'
WHERE id = 55;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Nicolas Pepe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Nicolas Pepe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Yan Diomande';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Ibrahim Sangare';

SELECT public.add_match_appearances(55, 'Curaçao', ARRAY[
  'Eloy Room', 'Joshua Brenet', 'Jurien Gaari', 'Armando Obispo', 'Deveron Fonville', 'Sherel Floranus',
  'Tahith Chong', 'Livano Comenencia', 'Leandro Bacuna', 'Juninho Bacuna', 'Jurgen Locadia',
  'Jeremy Antonisse', 'Tyrese Noslin', 'Gervane Kastaneer', 'Shurandy Sambo', 'Brandley Kuwas'
]);

SELECT public.add_match_appearances(55, 'Côte d''Ivoire', ARRAY[
  'Yahia Fofana', 'Christopher Operi', 'Ousmane Diomande', 'Odilon Kossounou', 'Guela Doué',
  'Franck Kessie', 'Ibrahim Sangare', 'Yan Diomande', 'Nicolas Pepe', 'Amad Diallo', 'Ange-Yoan Bonny',
  'Christ Inao Oulai', 'Bazoumana Toure', 'Elye Wahi', 'Oumar Diakite', 'Jean-Michael Seri'
]);

SELECT public.refresh_five_a_side_player_stats();
