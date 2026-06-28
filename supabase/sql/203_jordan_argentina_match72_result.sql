-- Match 72: Jordan 1-3 Argentina (Group J, 28 Jun 2026)
-- Goals: Lo Celso 19' | L. Martinez 31' (pen) | Tamari 55' (assist Haddad) | Messi 80'
-- MVP: Giovani Lo Celso
-- Lineups: SofaScore (Jun 28 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 3,
  mvp    = 'Giovani Lo Celso'
WHERE id = 72;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Giovani Lo Celso';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lautaro Martinez';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Jordan' AND name = 'Musa Al-Taamari';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Jordan' AND name = 'Ihsan Haddad';

SELECT public.add_match_appearances(72, 'Jordan', ARRAY[
  'Yazeed Abulaila', 'Abdallah Nasib', 'Yazan Al-Arab', 'Husam Abu Dahab', 'Ihsan Haddad',
  'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', 'Ali Azaizeh', 'Odeh Al-Fakhouri', 'Ali Olwan',
  'Musa Al-Taamari', 'Mahmoud Al-Mardi', 'Amer Jamous', 'Salim Obaid', 'Ibrahim Sabra'
]);

SELECT public.add_match_appearances(72, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Nicolas Tagliafico', 'Lisandro Martinez', 'Nicolas Otamendi', 'Exequiel Palacios',
  'Giovani Lo Celso', 'Nicolas Paz', 'Leandro Paredes', 'Giuliano Simeone', 'Julian Alvarez', 'Lautaro Martinez',
  'Thiago Almada', 'Lionel Messi', 'Alexis Mac Allister', 'Valentin Barco', 'Jose Manuel Lopez'
]);

SELECT public.refresh_five_a_side_player_stats();
