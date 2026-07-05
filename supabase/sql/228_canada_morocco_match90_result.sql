-- Match 90 (FIFA M90): Canada 0-3 Morocco (Round of 16, 4 Jul 2026 — W73 vs W75)
-- Goals: Ounahi 50', 82' (assists Hakimi, Brahim Diaz); Rahimi 90+8' (assist Brahim Diaz)
-- MVP: Azzedine Ounahi
-- Morocco advances to Quarter-final (match 97 team2 = W90)
-- Lineups: SofaScore (Jul 4 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 3,
  mvp       = 'Azzedine Ounahi',
  qualifier = 'Morocco'
WHERE id = 90;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Morocco' AND name = 'Azzedine Ounahi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Soufiane Rahimi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Achraf Hakimi';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Morocco' AND name = 'Brahim Diaz';

UPDATE public.matches SET team2 = 'Morocco'
WHERE id = 97 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(90, 'Canada', ARRAY[
  'Maxime Crepeau', 'Richie Laryea', 'Luc de Fougerolles', 'Moise Bombito', 'Alistair Johnston',
  'Ali Ahmed', 'Stephen Eustaquio', 'Niko Sigur', 'Tajon Buchanan', 'Tani Oluwaseyi', 'Jonathan David',
  'Cyle Larin', 'Jacob Shaffelburg', 'Promise David', 'Jonathan Osorio', 'Jayden Nelson'
]);

SELECT public.add_match_appearances(90, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Redouane Halhal', 'Noussair Mazraoui',
  'Ayyoub Bouaddi', 'Neil El Aynaoui', 'Brahim Diaz', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Ismael Saibari',
  'Soufiane Rahimi', 'Sofyan Amrabat', 'Chemsdine Talbi', 'Samir El Mourabet', 'Marwane Saadane'
]);

SELECT public.refresh_five_a_side_player_stats();
