-- Match 10: Netherlands 2-2 Japan (Group F, 14 Jun 2026)
-- Goals: van Dijk 51', Nakamura 57', Summerville 64', Kamada 88'
-- Assists: Gravenberch (x2), Kubo, Ogawa
-- MVP: Virgil van Dijk

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 2,
  mvp    = 'Virgil van Dijk'
WHERE id = 10;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Virgil van Dijk';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Keito Nakamura';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Netherlands' AND name = 'Crysencio Summerville';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Daichi Kamada';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Netherlands' AND name = 'Ryan Gravenberch';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Takefusa Kubo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Koki Ogawa';

SELECT public.add_match_appearances(10, 'Netherlands', ARRAY[
  'Bart Verbruggen', 'Denzel Dumfries', 'Jan Paul van Hecke', 'Virgil van Dijk', 'Micky van de Ven',
  'Ryan Gravenberch', 'Frenkie de Jong', 'Tijjani Reijnders', 'Crysencio Summerville', 'Donyell Malen', 'Cody Gakpo',
  'Quinten Timber', 'Teun Koopmeiners', 'Memphis Depay', 'Nathan Aké', 'Brian Brobbey'
]);

SELECT public.add_match_appearances(10, 'Japan', ARRAY[
  'Zion Suzuki', 'Tsuyoshi Watanabe', 'Shogo Taniguchi', 'Hiroki Ito', 'Ritsu Doan',
  'Kaishu Sano', 'Daichi Kamada', 'Keito Nakamura', 'Takefusa Kubo', 'Daizen Maeda', 'Ayase Ueda',
  'Junya Ito', 'Yukinari Sugawara', 'Takehiro Tomiyasu', 'Koki Ogawa', 'Kento Shiogai'
]);

SELECT public.refresh_five_a_side_player_stats();
