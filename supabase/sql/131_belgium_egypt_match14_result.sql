-- Match 14: Belgium 1-1 Egypt (Group G, 15 Jun 2026)
-- Goals: Ashour 19' (assist Salah) | Hany 66' (OG)
-- MVP: Emam Ashour
-- Lineups: SofaScore (Jun 15 2026)
-- Aboul-Fetouh (SofaScore) = Ahmed Fatouh in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Emam Ashour'
WHERE id = 14;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Emam Ashour';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Mohamed Salah';

SELECT public.add_match_appearances(14, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Timothy Castagne', 'Brandon Mechele', 'Nathan Ngoy', 'Thomas Meunier',
  'Youri Tielemans', 'Amadou Onana', 'Jeremy Doku', 'Kevin De Bruyne', 'Leandro Trossard', 'Charles De Ketelaere',
  'Maxim De Cuyper', 'Nicolas Raskin', 'Romelu Lukaku', 'Hans Vanaken', 'Matias Fernandez-Pardo'
]);

SELECT public.add_match_appearances(14, 'Egypt', ARRAY[
  'Mostafa Shobeir', 'Mohamed Hany', 'Yasser Ibrahim', 'Hamdi Fathy', 'Ahmed Fatouh',
  'Marwan Attia', 'Mohannad Lasheen', 'Mostafa Ziko', 'Mohamed Salah', 'Emam Ashour', 'Omar Marmoush',
  'Ramy Rabia', 'Ahmed Sayed Zizo', 'Hamza Abdel Karim', 'Karim Hafez', 'Ibrahim Adel'
]);

SELECT public.refresh_five_a_side_player_stats();
