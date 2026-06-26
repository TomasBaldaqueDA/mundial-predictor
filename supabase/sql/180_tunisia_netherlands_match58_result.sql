-- Match 58: Tunisia 1-3 Netherlands (Group F, 26 Jun 2026)
-- Goals: Skhiri 3' OG | Brobbey 7' (assist van Dijk) | Mastouri 54' (assist Mejbri) | van Hecke 62' (assist Reijnders)
-- MVP: Brian Brobbey
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 3,
  mvp    = 'Brian Brobbey'
WHERE id = 58;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Brian Brobbey';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Tunisia' AND name = 'Hazem Mastouri';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Jan Paul van Hecke';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Virgil van Dijk';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Tunisia' AND name = 'Hannibal Mejbri';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Tijjani Reijnders';

SELECT public.add_match_appearances(58, 'Tunisia', ARRAY[
  'Aymen Dahmene', 'Ali Abdi', 'Mohamed Amine Ben Hamida', 'Ellyes Skhiri', 'Montassar Talbi', 'Yan Valery',
  'Hannibal Mejbri', 'Rani Khedira', 'Ismael Gharbi', 'Anis Ben Slimane', 'Hazem Mastouri',
  'Hadj Mahmoud', 'Mortadha Ben Ouanes', 'Elias Achouri', 'Firas Chaouat', 'Sebastian Tounekti'
]);

SELECT public.add_match_appearances(58, 'Netherlands', ARRAY[
  'Bart Verbruggen', 'Denzel Dumfries', 'Jan Paul van Hecke', 'Virgil van Dijk', 'Nathan Aké',
  'Ryan Gravenberch', 'Frenkie de Jong', 'Tijjani Reijnders', 'Donyell Malen', 'Brian Brobbey', 'Cody Gakpo',
  'Teun Koopmeiners', 'Justin Kluivert', 'Crysencio Summerville', 'Memphis Depay', 'Noa Lang'
]);

SELECT public.refresh_five_a_side_player_stats();
