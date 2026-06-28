-- Match 70: Congo DR 3-1 Uzbekistan (Group K, 28 Jun 2026)
-- Goals: Shomurodov 10' (assist Mozgovoy) | Wissa 68' pen | Mayele 78' | Wissa 90+1 (assist Elia)
-- MVP: Yoane Wissa
-- Lineups: SofaScore (Jun 28 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 1,
  mvp    = 'Yoane Wissa'
WHERE id = 70;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Uzbekistan' AND name = 'Eldor Shomurodov';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Congo DR' AND name = 'Yoane Wissa';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Congo DR' AND name = 'Fiston Mayele';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Congo DR' AND name = 'Yoane Wissa';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Uzbekistan' AND name = 'Akmal Mozgovoy';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Congo DR' AND name = 'Meschack Elia';

SELECT public.add_match_appearances(70, 'Congo DR', ARRAY[
  'Lionel Mpasi', 'Arthur Masuaku', 'Alex Tuanzebe', 'Chancel Mbemba', 'Aaron Wan-Bissaka',
  'Brian Cipenga', 'Noah Sadiki', 'Samuel Moutoussamy', 'Nathanael Mbuku', 'Yoane Wissa', 'Cedric Bakambu',
  'Fiston Mayele', 'Theo Bongonda', 'Ngal''ayel Mukau', 'Meschack Elia', 'Joris Kayembe'
]);

SELECT public.add_match_appearances(70, 'Uzbekistan', ARRAY[
  'Abduvohid Nematov', 'Khojiakbar Alijonov', 'Rustam Ashurmatov', 'Abdukodir Khusanov', 'Jakhongir Urozov', 'Sherzod Nasrullaev',
  'Dostonbek Khamdamov', 'Akmal Mozgovoy', 'Otabek Shukurov', 'Abbosbek Fayzullaev', 'Eldor Shomurodov',
  'Azizjon Ganiev', 'Odiljon Hamrobekov', 'Oston Urunov', 'Jamshid Iskanderov', 'Igor Sergeev'
]);

SELECT public.refresh_five_a_side_player_stats();
