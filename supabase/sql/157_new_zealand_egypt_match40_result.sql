-- Match 40: New Zealand 1-3 Egypt (Group G, 22 Jun 2026)
-- Goals: Surman 15' (assist Payne) | Ziko 58' (assist Hany) | Salah 67' (assist Ziko) | Trezeguet 82' (assist Salah)
-- MVP: Mohamed Salah
-- Lineups: SofaScore (Jun 22 2026); Aboul-Fetouh (SofaScore) = Ahmed Fatouh in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 3,
  mvp    = 'Mohamed Salah'
WHERE id = 40;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'New Zealand' AND name = 'Finn Surman';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mostafa Ziko';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mohamed Salah';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mahmoud Trezeguet';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'New Zealand' AND name = 'Tim Payne';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Mohamed Hany';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Mostafa Ziko';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Mohamed Salah';

SELECT public.add_match_appearances(40, 'New Zealand', ARRAY[
  'Max Crocombe', 'Tim Payne', 'Finn Surman', 'Michael Boxall', 'Liberato Cacace',
  'Joe Bell', 'Marko Stamenic', 'Callum McCowatt', 'Sarpreet Singh', 'Eli Just', 'Chris Wood',
  'Ben Old', 'Jesse Randall', 'Ryan Thomas', 'Tyler Bindon', 'Francis de Vries'
]);

SELECT public.add_match_appearances(40, 'Egypt', ARRAY[
  'Mostafa Shobeir', 'Mohamed Hany', 'Yasser Ibrahim', 'Hamdi Fathy', 'Ahmed Fatouh',
  'Marwan Attia', 'Mohannad Lasheen', 'Mostafa Ziko', 'Mohamed Salah', 'Emam Ashour', 'Omar Marmoush',
  'Ramy Rabia', 'Mahmoud Trezeguet', 'Hamza Abdel Karim', 'Ahmed Sayed Zizo', 'Hossam Abdelmaguid', 'Mohamed Abdelmonem'
]);

SELECT public.refresh_five_a_side_player_stats();
