-- Match 33: Netherlands 5-1 Sweden (Group F, 20 Jun 2026)
-- Goals: Brobbey 5' (assist Gakpo), 17' (assist Dumfries) | Gakpo 47', 54' (assist Summerville)
--        Summerville 89' (assist Depay) | Elanga 59' (assist Isak)
-- MVP: Cody Gakpo
-- Lineups: SofaScore (Jun 20 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 5,
  score2 = 1,
  mvp    = 'Cody Gakpo'
WHERE id = 33;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Brian Brobbey';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Brian Brobbey';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Cody Gakpo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Cody Gakpo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Crysencio Summerville';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Sweden' AND name = 'Anthony Elanga';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Cody Gakpo';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Netherlands' AND name = 'Denzel Dumfries';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Crysencio Summerville';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Netherlands' AND name = 'Memphis Depay';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Sweden' AND name = 'Alexander Isak';

SELECT public.add_match_appearances(33, 'Netherlands', ARRAY[
  'Bart Verbruggen', 'Denzel Dumfries', 'Jan Paul van Hecke', 'Virgil van Dijk', 'Micky van de Ven',
  'Frenkie de Jong', 'Ryan Gravenberch', 'Tijjani Reijnders', 'Donyell Malen', 'Brian Brobbey', 'Cody Gakpo',
  'Crysencio Summerville', 'Guus Til', 'Teun Koopmeiners', 'Memphis Depay', 'Noa Lang'
]);

SELECT public.add_match_appearances(33, 'Sweden', ARRAY[
  'Kristoffer Nordfeldt', 'Victor Lindelof', 'Isak Hien', 'Gustaf Lagerbielke', 'Jesper Karlstrom',
  'Gabriel Gudmundsson', 'Yasin Ayari', 'Benjamin Nygren', 'Alexander Bernhardsson', 'Alexander Isak', 'Viktor Gyokeres',
  'Anthony Elanga', 'Besfort Zeneli', 'Lucas Bergvall', 'Taha Ali', 'Elliot Stroud'
]);

SELECT public.refresh_five_a_side_player_stats();
