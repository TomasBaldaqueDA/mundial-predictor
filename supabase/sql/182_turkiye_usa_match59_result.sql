-- Match 59: Türkiye 3-2 USA (Group D, 26 Jun 2026)
-- Goals: Trusty 3' (assist Berhalter) | Guler 10' (assist Yilmaz) | Yilmaz 31' (assist Kokcu)
--        Berhalter 49' | Ayhan 90+8
-- MVP: Arda Guler
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 2,
  mvp    = 'Arda Guler'
WHERE id = 59;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Auston Trusty';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Türkiye' AND name = 'Arda Guler';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Türkiye' AND name = 'Baris Alper Yilmaz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Sebastian Berhalter';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Türkiye' AND name = 'Kaan Ayhan';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'USA' AND name = 'Sebastian Berhalter';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Türkiye' AND name = 'Baris Alper Yilmaz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Türkiye' AND name = 'Orkun Kokcu';

SELECT public.add_match_appearances(59, 'Türkiye', ARRAY[
  'Ugurcan Cakir', 'Abdulkerim Bardakci', 'Ozan Kabak', 'Zeki Celik', 'Eren Elmali',
  'Orkun Kokcu', 'Salih Ozcan', 'Oguz Aydin', 'Kenan Yildiz', 'Arda Guler', 'Baris Alper Yilmaz',
  'Caglar Soyuncu', 'Can Uzun', 'Kaan Ayhan', 'Mert Muldur', 'Irfan Can Kahveci'
]);

SELECT public.add_match_appearances(59, 'USA', ARRAY[
  'Matt Turner', 'Joe Scally', 'Miles Robinson', 'Mark McKenzie', 'Auston Trusty',
  'Brenden Aaronson', 'Weston McKennie', 'Gio Reyna', 'Ricardo Pepi', 'Sebastian Berhalter', 'Timothy Weah',
  'Christian Pulisic', 'Sergiño Dest', 'Alejandro Zendejas', 'Alex Freeman', 'Malik Tillman'
]);

SELECT public.refresh_five_a_side_player_stats();
