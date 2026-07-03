-- Match 83 (FIFA M84): Spain 3-0 Austria (Round of 32, 2 Jul 2026 — 1H vs 2J)
-- Goals: Oyarzabal 36', 89' (assist Cucurella) | Porro 66' (assist Baena)
-- MVP: Lamine Yamal
-- Spain advances to Round of 16 (match 93 team2 = W84)
-- Lineups: SofaScore (Jul 2 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 0,
  mvp       = 'Lamine Yamal',
  qualifier = 'Spain'
WHERE id = 83;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Oyarzabal';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Oyarzabal';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Pedro Porro';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Marc Cucurella';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Marc Cucurella';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Álex Baena';

UPDATE public.matches SET team2 = 'Spain'
WHERE id = 93 AND stage = 'Round of 16';

SELECT public.add_match_appearances(83, 'Spain', ARRAY[
  'Unai Simón', 'Marc Cucurella', 'Aymeric Laporte', 'Pau Cubarsí', 'Pedro Porro',
  'Pedri', 'Rodri', 'Álex Baena', 'Dani Olmo', 'Lamine Yamal', 'Mikel Oyarzabal',
  'Mikel Merino', 'Ferran Torres', 'Gavi', 'Marc Pubill', 'Fabián Ruiz'
]);

SELECT public.add_match_appearances(83, 'Austria', ARRAY[
  'Alexander Schlager', 'Stefan Posch', 'Kevin Danso', 'David Alaba', 'Konrad Laimer',
  'Nicolas Seiwald', 'Xaver Schlager', 'Romano Schmid', 'Paul Wanner', 'Marcel Sabitzer', 'Michael Gregoritsch',
  'Carney Chukwuemeka', 'Florian Grillitsch', 'Marko Arnautovic', 'Sasa Kalajdzic', 'Alexander Prass'
]);

SELECT public.refresh_five_a_side_player_stats();
