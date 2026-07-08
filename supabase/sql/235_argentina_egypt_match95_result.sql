-- Match 95 (FIFA M95): Argentina 3-2 Egypt (Round of 16, 7 Jul 2026 — W86 vs W88)
-- Goals: Ibrahim 15' (assist Attia); Ziko 67' (assist Hassan); Romero 79' (assist Messi); Messi 83' (assist Montiel); Fernandez 90+2' (assist L. Martinez)
-- MVP: Lionel Messi
-- Argentina advances to Quarter-final (match 100 team1 = W95)
-- Lineups: SofaScore (Jul 7 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 2,
  mvp       = 'Lionel Messi',
  qualifier = 'Argentina'
WHERE id = 95;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Cristian Romero';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Enzo Fernandez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Yasser Ibrahim';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mostafa Ziko';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Gonzalo Montiel';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Lautaro Martinez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Marwan Attia';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Haitham Hassan';

UPDATE public.matches SET team1 = 'Argentina'
WHERE id = 100 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(95, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Nahuel Molina', 'Cristian Romero', 'Lisandro Martinez', 'Nicolas Tagliafico',
  'Leandro Paredes', 'Rodrigo De Paul', 'Alexis Mac Allister', 'Lionel Messi', 'Julian Alvarez', 'Enzo Fernandez',
  'Lautaro Martinez', 'Nicolas Gonzalez', 'Gonzalo Montiel', 'Facundo Medina', 'Nicolas Otamendi'
]);

SELECT public.add_match_appearances(95, 'Egypt', ARRAY[
  'Mostafa Shobeir', 'Mohamed Hany', 'Yasser Ibrahim', 'Ramy Rabia', 'Karim Hafez',
  'Mohannad Lasheen', 'Marwan Attia', 'Emam Ashour', 'Mohamed Salah', 'Haitham Hassan', 'Mostafa Ziko',
  'Hamdi Fathy', 'Mahmoud Trezeguet', 'Omar Marmoush', 'Ahmed Sayed Zizo'
]);

SELECT public.refresh_five_a_side_player_stats();
