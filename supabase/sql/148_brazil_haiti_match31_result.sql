-- Match 31: Brazil 3-0 Haiti (Group C, 20 Jun 2026)
-- Goals: Cunha 23', 36' (assist Vinicius Jr) | Vinicius Jr 45+3 (assist Paqueta)
-- MVP: Vinicius Jr
-- Lineups: SofaScore (Jun 20 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 0,
  mvp    = 'Vinicius Jr'
WHERE id = 31;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Matheus Cunha';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Matheus Cunha';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Vinicius Jr';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Vinicius Jr';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Lucas Paqueta';

SELECT public.add_match_appearances(31, 'Brazil', ARRAY[
  'Alisson', 'Douglas Santos', 'Gabriel Magalhaes', 'Marquinhos', 'Danilo',
  'Lucas Paqueta', 'Casemiro', 'Bruno Guimaraes', 'Vinicius Jr', 'Matheus Cunha', 'Raphinha',
  'Rayan', 'Gabriel Martinelli', 'Endrick', 'Danilo Santos', 'Ederson'
]);

SELECT public.add_match_appearances(31, 'Haiti', ARRAY[
  'Johnny Placide', 'Carlens Arcus', 'JK Duverne', 'Ricardo Ade', 'Hannes Delcroix', 'Martin Experience',
  'Josué Casimir', 'Jean-Jacques Danley', 'Jeanricner Bellegarde', 'Ruben Providence', 'Frantzdy Pierrot',
  'Dominique Simon', 'Wilson Isidor', 'Louicius Deedson', 'Lenny Joseph', 'Derrick Etienne'
]);

SELECT public.refresh_five_a_side_player_stats();
