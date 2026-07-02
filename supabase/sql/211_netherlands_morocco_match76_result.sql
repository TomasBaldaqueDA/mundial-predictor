-- Match 76: Netherlands 1-1 Morocco, PSO 2-3 (Round of 32, 30 Jun 2026 — 1F vs 2C)
-- Goals: Gakpo 72' (assist Summerville) | Diop 90+1' (assist Talbi)
-- MVP: Issa Diop
-- Morocco advances to Round of 16 (match 90 team2 = W75, FIFA M75)
-- Lineups: SofaScore (Jun 30 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Issa Diop',
  qualifier = 'Morocco'
WHERE id = 76;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Cody Gakpo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Morocco' AND name = 'Issa Diop';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Crysencio Summerville';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Morocco' AND name = 'Chemsdine Talbi';

UPDATE public.matches SET team2 = 'Morocco'
WHERE id = 90 AND stage = 'Round of 16';

SELECT public.add_match_appearances(76, 'Netherlands', ARRAY[
  'Bart Verbruggen', 'Nathan Aké', 'Virgil van Dijk', 'Jan Paul van Hecke', 'Micky van de Ven',
  'Frenkie de Jong', 'Ryan Gravenberch', 'Denzel Dumfries', 'Cody Gakpo', 'Crysencio Summerville', 'Brian Brobbey',
  'Teun Koopmeiners', 'Wout Weghorst', 'Jorrel Hato', 'Quinten Timber', 'Marten de Roon', 'Justin Kluivert'
]);

SELECT public.add_match_appearances(76, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Chadi Riad', 'Noussair Mazraoui',
  'Ayyoub Bouaddi', 'Neil El Aynaoui', 'Brahim Diaz', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Ismael Saibari',
  'Anass Salah-Eddine', 'Gessime Yassine', 'Samir El Mourabet', 'Soufiane Rahimi', 'Chemsdine Talbi'
]);

SELECT public.refresh_five_a_side_player_stats();
