-- Match 52: Morocco 4-2 Haiti (Group C, 24 Jun 2026)
-- Goals: Bounou 10' (OG) | Hakimi 39' | Isidor 43' (assist Duverne) | Saibari 45+1 (assist Hakimi)
--        Rahimi 78' (assist Riad) | Yassine 89' (assist Rahimi)
-- MVP: Achraf Hakimi
-- Lineups: SofaScore (Jun 24 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 2,
  mvp    = 'Achraf Hakimi'
WHERE id = 52;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Achraf Hakimi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Ismael Saibari';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Soufiane Rahimi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Gessime Yassine';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Haiti' AND name = 'Wilson Isidor';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Achraf Hakimi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Haiti' AND name = 'JK Duverne';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Chadi Riad';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Soufiane Rahimi';

SELECT public.add_match_appearances(52, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Redouane Halhal', 'Chadi Riad', 'Anass Salah-Eddine',
  'Neil El Aynaoui', 'Sofyan Amrabat', 'Brahim Diaz', 'Ismael Saibari', 'Bilal El Khannouss', 'Ayoub El Kaabi',
  'Soufiane Rahimi', 'Azzedine Ounahi', 'Gessime Yassine', 'Noussair Mazraoui', 'Samir El Mourabet'
]);

SELECT public.add_match_appearances(52, 'Haiti', ARRAY[
  'Johnny Placide', 'Ruben Providence', 'Jeanricner Bellegarde', 'Jean-Jacques Danley', 'Josué Casimir',
  'Martin Experience', 'Hannes Delcroix', 'Ricardo Ade', 'JK Duverne', 'Wilson Isidor', 'Lenny Joseph',
  'Louicius Deedson', 'Duckens Nazon', 'Carlens Arcus', 'Dominique Simon', 'Frantzdy Pierrot'
]);

SELECT public.refresh_five_a_side_player_stats();
