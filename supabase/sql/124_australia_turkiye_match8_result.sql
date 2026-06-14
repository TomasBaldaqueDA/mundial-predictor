-- Match 8: Australia 2-0 Türkiye (Group D, 14 Jun 2026)
-- Goals: Irankunda 27', Metcalfe 75'
-- Assist: Paul Okon-Engstler (Irankunda)
-- MVP: Nestory Irankunda

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp    = 'Nestory Irankunda'
WHERE id = 8;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Australia' AND name = 'Nestory Irankunda';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Australia' AND name = 'Connor Metcalfe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Australia' AND name = 'Paul Okon-Engstler';

SELECT public.add_match_appearances(8, 'Australia', ARRAY[
  'Patrick Beach', 'Jordan Bos', 'Cameron Burgess', 'Harry Souttar', 'Alessandro Circati', 'Jacob Italiano',
  'Nestory Irankunda', 'Paul Okon-Engstler', 'Aiden O''Neill', 'Connor Metcalfe', 'Mohamed Toure',
  'Nishan Velupillay', 'Jason Geria', 'Tete Yengi', 'Jackson Irvine', 'Aziz Behich'
]);

SELECT public.add_match_appearances(8, 'Türkiye', ARRAY[
  'Ugurcan Cakir', 'Zeki Celik', 'Merih Demiral', 'Abdulkerim Bardakci', 'Ferdi Kadioglu',
  'Ismail Yuksek', 'Hakan Calhanoglu', 'Arda Guler', 'Orkun Kokcu', 'Baris Alper Yilmaz', 'Kerem Akturkoglu',
  'Kenan Yildiz', 'Yunus Akgun', 'Mert Muldur', 'Salih Ozcan', 'Deniz Gul'
]);

SELECT public.refresh_five_a_side_player_stats();
