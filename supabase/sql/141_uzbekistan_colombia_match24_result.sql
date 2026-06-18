-- Match 24: Uzbekistan 1-3 Colombia (Group K, 18 Jun 2026)
-- Goals: Munoz 40' (assist Diaz) | Fayzullaev 60' | Diaz 65' (assist Puerta) | Campaz 90+9' (assist Hernandez)
-- MVP: Luis Diaz
-- Lineups: SofaScore (Jun 18 2026)
-- Amonov (SofaScore) = Azizbek Amonov in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 3,
  mvp    = 'Luis Diaz'
WHERE id = 24;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Uzbekistan' AND name = 'Abbosbek Fayzullaev';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Colombia' AND name = 'Daniel Munoz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Colombia' AND name = 'Luis Diaz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Colombia' AND name = 'Jaminton Campaz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Colombia' AND name = 'Luis Diaz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Colombia' AND name = 'Gustavo Puerta';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Colombia' AND name = 'Juan Camilo Hernandez';

SELECT public.add_match_appearances(24, 'Uzbekistan', ARRAY[
  'Utkir Yusupov', 'Abdukodir Khusanov', 'Rustam Ashurmatov', 'Sherzod Nasrullaev', 'Otabek Shukurov',
  'Abdulla Abdullaev', 'Odiljon Hamrobekov', 'Oston Urunov', 'Abbosbek Fayzullaev', 'Eldor Shomurodov',
  'Farrukh Sayfiev', 'Dostonbek Khamdamov', 'Jakhongir Urozov', 'Azizbek Amonov', 'Igor Sergeev'
]);

SELECT public.add_match_appearances(24, 'Colombia', ARRAY[
  'Camilo Vargas', 'Daniel Munoz', 'Davinson Sanchez', 'Johan Mojica', 'Santiago Arias',
  'Jefferson Lerma', 'James Rodriguez', 'Gustavo Puerta', 'Jhon Arias', 'Luis Suarez', 'Luis Diaz',
  'Jaminton Campaz', 'Richard Rios', 'Juan Camilo Hernandez', 'Kevin Castano', 'Carlos Gomez'
]);

SELECT public.refresh_five_a_side_player_stats();
