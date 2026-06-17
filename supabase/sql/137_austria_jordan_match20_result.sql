-- Match 20: Austria 3-1 Jordan (Group J, 17 Jun 2026)
-- Goals: Schmid 21' (assist X. Schlager) | Olwan 50' (assist Al-Rawabdeh) | Al-Arab 76' (OG) | Arnautovic 90+12' (pen)
-- MVP: Ali Olwan
-- Lineups: SofaScore (Jun 17 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 1,
  mvp    = 'Ali Olwan'
WHERE id = 20;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Romano Schmid';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Jordan' AND name = 'Ali Olwan';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Marko Arnautovic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'Xaver Schlager';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Jordan' AND name = 'Noor Al-Rawabdeh';

SELECT public.add_match_appearances(20, 'Austria', ARRAY[
  'Alexander Schlager', 'Philipp Mwene', 'Philipp Lienhart', 'David Alaba', 'Alexander Prass',
  'Marcel Sabitzer', 'Florian Grillitsch', 'Romano Schmid', 'Konrad Laimer', 'Xaver Schlager', 'Michael Gregoritsch',
  'Marko Arnautovic', 'Kevin Danso', 'Paul Wanner', 'Carney Chukwuemeka', 'Patrick Wimmer'
]);

SELECT public.add_match_appearances(20, 'Jordan', ARRAY[
  'Yazeed Abulaila', 'Yazan Al-Arab', 'Abdallah Nasib', 'Ihsan Haddad', 'Mohannad Abu Taha',
  'Odeh Al-Fakhouri', 'Rajaei Ayed', 'Noor Al-Rawabdeh', 'Ibrahim Sadeh', 'Musa Al-Taamari', 'Ali Olwan',
  'Salim Obaid', 'Mahmoud Al-Mardi', 'Saed Al-Rosan', 'Mohammad Al-Dawoud', 'Ali Azaizeh'
]);

SELECT public.refresh_five_a_side_player_stats();
