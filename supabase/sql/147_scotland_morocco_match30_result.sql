-- Match 30: Scotland 0-1 Morocco (Group C, 19 Jun 2026)
-- Goals: Saibari 2' (assist Brahim Diaz)
-- MVP: Ismael Saibari
-- Lineups: SofaScore (Jun 19 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'Ismael Saibari'
WHERE id = 30;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Ismael Saibari';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Brahim Diaz';

SELECT public.add_match_appearances(30, 'Scotland', ARRAY[
  'Angus Gunn', 'Andy Robertson', 'Jack Hendry', 'Grant Hanley', 'Nathan Patterson',
  'Kieran Tierney', 'Lewis Ferguson', 'Ryan Christie', 'John McGinn', 'Scott McTominay', 'Che Adams',
  'Ben Gannon-Doak', 'Kenny McLean', 'Lyndon Dykes', 'Ross Stewart', 'Anthony Ralston'
]);

SELECT public.add_match_appearances(30, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Chadi Riad', 'Noussair Mazraoui',
  'Ayyoub Bouaddi', 'Neil El Aynaoui', 'Brahim Diaz', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Ismael Saibari',
  'Ayoube Amaimouni', 'Chemsdine Talbi', 'Soufiane Rahimi', 'Samir El Mourabet'
]);

SELECT public.refresh_five_a_side_player_stats();
