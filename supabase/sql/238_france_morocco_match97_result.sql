-- Match 97 (FIFA M97): France 2-0 Morocco (Quarter-final, 9 Jul 2026 — W89 vs W90)
-- Goals: Mbappe 60' (assist Doue); Dembele 66' (assist Mbappe)
-- MVP: Kylian Mbappe
-- France advances to Semi-final (match 101 team1 = W97)
-- Lineups: SofaScore (Jul 9 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp       = 'Kylian Mbappe',
  qualifier = 'France'
WHERE id = 97;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Desire Doue';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.matches SET team1 = 'France'
WHERE id = 101 AND stage = 'Semi-final';

SELECT public.add_match_appearances(97, 'France', ARRAY[
  'Mike Maignan', 'Lucas Digne', 'William Saliba', 'Dayot Upamecano', 'Jules Kounde',
  'Adrien Rabiot', 'Manu Kone', 'Desire Doue', 'Michael Olise', 'Ousmane Dembele', 'Kylian Mbappe',
  'Warren Zaire-Emery', 'Jean-Philippe Mateta', 'Bradley Barcola', 'Malo Gusto'
]);

SELECT public.add_match_appearances(97, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Noussair Mazraoui', 'Anass Salah-Eddine',
  'Ayyoub Bouaddi', 'Azzedine Ounahi', 'Brahim Diaz', 'Bilal El Khannouss', 'Neil El Aynaoui', 'Chemsdine Talbi',
  'Sofyan Amrabat', 'Soufiane Rahimi', 'Zakaria El Ouahdi', 'Gessime Yassine'
]);

SELECT public.refresh_five_a_side_player_stats();
