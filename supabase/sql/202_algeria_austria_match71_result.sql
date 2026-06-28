-- Match 71: Algeria 3-3 Austria (Group J, 28 Jun 2026)
-- Goals: Arnautovic 28' (assist Alaba) | Belghali 45' | Sabitzer 55' (assist Laimer)
--        Mahrez 60', 90+3 (assist Aouar) | Kalajdzic 90+6 (assist Gregoritsch)
-- MVP: Riyad Mahrez
-- Lineups: SofaScore (Jun 28 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 3,
  mvp    = 'Riyad Mahrez'
WHERE id = 71;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Marko Arnautovic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Algeria' AND name = 'Rafik Belghali';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Marcel Sabitzer';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Algeria' AND name = 'Riyad Mahrez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Austria' AND name = 'Sasa Kalajdzic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'David Alaba';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'Konrad Laimer';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Algeria' AND name = 'Houssem Aouar';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Austria' AND name = 'Michael Gregoritsch';

SELECT public.add_match_appearances(71, 'Algeria', ARRAY[
  'Oussama Benbot', 'Rafik Belghali', 'Jaouen Hadjam', 'Ramy Bensebaini', 'Rayan Ait-Nouri',
  'Nabil Bentaleb', 'Hicham Boudaoui', 'Fares Chaibi', 'Houssem Aouar', 'Riyad Mahrez', 'Amine Gouiri',
  'Samir Chergui', 'Zineddine Belaid', 'Fares Ghedjemis', 'Aissa Mandi', 'Ramiz Zerrouki'
]);

SELECT public.add_match_appearances(71, 'Austria', ARRAY[
  'Alexander Schlager', 'Konrad Laimer', 'David Alaba', 'Phillipp Mwene', 'Stefan Posch',
  'Xaver Schlager', 'Marcel Sabitzer', 'Romano Schmid', 'Marko Arnautovic', 'Michael Gregoritsch', 'Paul Wanner',
  'Florian Grillitsch', 'Kevin Danso', 'Sasa Kalajdzic', 'Alexander Prass', 'Marco Friedl'
]);

SELECT public.refresh_five_a_side_player_stats();
