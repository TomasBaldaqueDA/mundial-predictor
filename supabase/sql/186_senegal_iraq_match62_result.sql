-- Match 62: Senegal 5-0 Iraq (Group I, 26 Jun 2026)
-- Goals: Diarra 4' (assist Seck) | Sarr 56' (assist Camara) | Gueye 59' (assist Sarr)
--        Gueye 71' (assist Ndiaye) | Ndiaye 82' (assist Gueye)
-- MVP: Pape Gueye
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 5,
  score2 = 0,
  mvp    = 'Pape Gueye'
WHERE id = 62;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Habib Diarra';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Ismaila Sarr';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Pape Gueye';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Pape Gueye';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Iliman Ndiaye';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Abdoulaye Seck';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Lamine Camara';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Ismaila Sarr';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Iliman Ndiaye';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Pape Gueye';

SELECT public.add_match_appearances(62, 'Senegal', ARRAY[
  'Mory Diaw', 'Ismail Jakobs', 'Moussa Niakhate', 'Abdoulaye Seck', 'Krepin Diatta',
  'Lamine Camara', 'Idrissa Gana Gueye', 'Habib Diarra', 'Sadio Mane', 'Ismaila Sarr', 'Ibrahim Mbaye',
  'Pape Gueye', 'Pathe Ciss', 'Nicolas Jackson', 'Iliman Ndiaye', 'Assane Diao'
]);

SELECT public.add_match_appearances(62, 'Iraq', ARRAY[
  'Ahmed Basil', 'Frans Putros', 'Rebin Sulaka', 'Akam Hashim', 'Merchas Doski',
  'Amir Al-Ammari', 'Ibrahim Bayesh', 'Ahmed Qasem', 'Zidane Iqbal', 'Ali Jassim', 'Ali Al-Hamadi',
  'Manaf Younis', 'Jalal Hassan', 'Ali Yousef', 'Kevin Yakob'
]);

SELECT public.refresh_five_a_side_player_stats();
