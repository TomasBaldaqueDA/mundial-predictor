-- Match 65: Egypt 1-1 IR Iran (Group G, 27 Jun 2026)
-- Goals: Saber 5' (assist Trezeguet) | Rezaeian 14'
-- MVP: Ramin Rezaeian
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Ramin Rezaeian'
WHERE id = 65;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mahmoud Saber';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'IR Iran' AND name = 'Ramin Rezaeian';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Mahmoud Trezeguet';

SELECT public.add_match_appearances(65, 'Egypt', ARRAY[
  'Mostafa Shobeir', 'Ahmed Fatouh', 'Mohamed Abdelmonem', 'Ramy Rabia', 'Mohamed Hany',
  'Mahmoud Saber', 'Mohannad Lasheen', 'Mahmoud Trezeguet', 'Mohamed Salah', 'Emam Ashour', 'Mostafa Ziko',
  'Yasser Ibrahim', 'Omar Marmoush', 'Marwan Attia', 'Ahmed Sayed Zizo', 'Hamza Abdel Karim'
]);

SELECT public.add_match_appearances(65, 'IR Iran', ARRAY[
  'Alireza Beiranvand', 'Ramin Rezaeian', 'Hossein Kanaani', 'Shoja Khalilzadeh', 'Ali Nemati', 'Milad Mohammadi',
  'Saman Ghoddos', 'Mohammad Ghorbani', 'Saeid Ezatolahi', 'Mohammad Mohebi', 'Mehdi Taremi',
  'Saleh Hardani', 'Shahriar Moghanlou', 'Alireza Jahanbakhsh'
]);

SELECT public.refresh_five_a_side_player_stats();
