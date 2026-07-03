-- Match 85: Switzerland 2-0 Algeria (Round of 32, 3 Jul 2026 — 1B vs 3EFGIJ)
-- Goals: Embolo 10' (assist Manzambi) | Ndoye 46'
-- MVP: Breel Embolo
-- Switzerland advances to Round of 16 (match 96 team1 = W85)
-- Lineups: SofaScore (Jul 3 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp       = 'Breel Embolo',
  qualifier = 'Switzerland'
WHERE id = 85;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Breel Embolo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Dan Ndoye';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Johan Manzambi';

UPDATE public.matches SET team1 = 'Switzerland'
WHERE id = 96 AND stage = 'Round of 16';

SELECT public.add_match_appearances(85, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Ricardo Rodriguez', 'Manuel Akanji', 'Nico Elvedi', 'Denis Zakaria',
  'Granit Xhaka', 'Remo Freuler', 'Ruben Vargas', 'Johan Manzambi', 'Dan Ndoye', 'Breel Embolo',
  'Noah Okafor', 'Fabian Rieder', 'Zeki Amdouni', 'Silvan Widmer', 'Michel Aebischer'
]);

SELECT public.add_match_appearances(85, 'Algeria', ARRAY[
  'Luca Zidane', 'Rafik Belghali', 'Aissa Mandi', 'Ramy Bensebaini', 'Rayan Ait-Nouri',
  'Riyad Mahrez', 'Ramiz Zerrouki', 'Nabil Bentaleb', 'Ibrahim Maza', 'Houssem Aouar', 'Fares Chaibi',
  'Jaouen Hadjam', 'Amine Gouiri', 'Anis Hadj Moussa', 'Hicham Boudaoui', 'Adil Boulbina'
]);

SELECT public.refresh_five_a_side_player_stats();
