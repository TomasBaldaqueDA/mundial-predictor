-- Match 6: Brazil 1-1 Morocco (Group C, 13 Jun 2026)
-- Goals: Vinicius Jr 32' | Saibari 21'
-- Assists: Bruno Guimaraes (Vinicius), Brahim Diaz (Saibari)
-- MVP: Vinicius Jr

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Vinicius Jr'
WHERE id = 6;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Vinicius Jr';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Ismael Saibari';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Bruno Guimaraes';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Brahim Diaz';

SELECT public.add_match_appearances(6, 'Brazil', ARRAY[
  'Alisson', 'Douglas Santos', 'Gabriel Magalhaes', 'Marquinhos', 'Ibanez',
  'Bruno Guimaraes', 'Casemiro', 'Vinicius Jr', 'Raphinha', 'Lucas Paqueta', 'Igor Thiago',
  'Danilo', 'Fabinho', 'Matheus Cunha', 'Luiz Henrique', 'Danilo Santos'
]);

SELECT public.add_match_appearances(6, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Chadi Riad', 'Noussair Mazraoui',
  'Neil El Aynaoui', 'Ayyoub Bouaddi', 'Brahim Diaz', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Ismael Saibari',
  'Chemsdine Talbi', 'Samir El Mourabet', 'Anass Salah-Eddine', 'Ayoube Amaimouni', 'Soufiane Rahimi'
]);

SELECT public.refresh_five_a_side_player_stats();
