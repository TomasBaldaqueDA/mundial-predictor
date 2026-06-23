-- Match 44: Jordan 1-2 Algeria (Group J, 23 Jun 2026)
-- Goals: Al-Rashdan 36' (assist Tamari) | Benbouali 69' (assist Mahrez) | Gouiri 82'
-- MVP: Ibrahim Maza
-- Lineups: SofaScore (Jun 23 2026); Abudahab (SofaScore) = Husam Abu Dahab in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 2,
  mvp    = 'Ibrahim Maza'
WHERE id = 44;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Jordan' AND name = 'Nizar Al-Rashdan';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Algeria' AND name = 'Nadhir Benbouali';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Algeria' AND name = 'Amine Gouiri';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Jordan' AND name = 'Musa Al-Taamari';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Algeria' AND name = 'Riyad Mahrez';

SELECT public.add_match_appearances(44, 'Jordan', ARRAY[
  'Yazeed Abulaila', 'Husam Abu Dahab', 'Yazan Al-Arab', 'Abdallah Nasib', 'Mohannad Abu Taha',
  'Noor Al-Rawabdeh', 'Nizar Al-Rashdan', 'Ihsan Haddad', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Musa Al-Taamari',
  'Odeh Al-Fakhouri', 'Ali Azaizeh', 'Mohammad Abu Hashish', 'Salim Obaid', 'Mohammad Abu Zrayq'
]);

SELECT public.add_match_appearances(44, 'Algeria', ARRAY[
  'Luca Zidane', 'Rafik Belghali', 'Aissa Mandi', 'Ramy Bensebaini', 'Rayan Ait-Nouri',
  'Hicham Boudaoui', 'Ramiz Zerrouki', 'Riyad Mahrez', 'Ibrahim Maza', 'Fares Chaibi', 'Amine Gouiri',
  'Nabil Bentaleb', 'Nadhir Benbouali', 'Anis Hadj Moussa', 'Jaouen Hadjam', 'Zineddine Belaid'
]);

SELECT public.refresh_five_a_side_player_stats();
