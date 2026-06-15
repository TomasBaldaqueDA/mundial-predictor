-- Match 12: Sweden 5-1 Tunisia (Group F, 15 Jun 2026)
-- Goals: Ayari 7' & 90'+6, Isak 30', Rekik 43', Gyokeres 59', Svanberg 84'
-- Assists: Gyokeres, Mejbri, Isak (x2), Bergvall
-- MVP: Alexander Isak

UPDATE public.matches
SET
  status = 'finished',
  score1 = 5,
  score2 = 1,
  mvp    = 'Alexander Isak'
WHERE id = 12;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Sweden' AND name = 'Yasin Ayari';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Sweden' AND name = 'Alexander Isak';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Tunisia' AND name = 'Omar Rekik';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Sweden' AND name = 'Viktor Gyokeres';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Sweden' AND name = 'Mattias Svanberg';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Sweden' AND name = 'Viktor Gyokeres';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Tunisia' AND name = 'Hannibal Mejbri';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Sweden' AND name = 'Alexander Isak';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Sweden' AND name = 'Lucas Bergvall';

SELECT public.add_match_appearances(12, 'Sweden', ARRAY[
  'Kristoffer Nordfeldt', 'Gustaf Lagerbielke', 'Isak Hien', 'Victor Lindelof', 'Alexander Bernhardsson',
  'Jesper Karlstrom', 'Yasin Ayari', 'Gabriel Gudmundsson', 'Benjamin Nygren', 'Alexander Isak', 'Viktor Gyokeres',
  'Lucas Bergvall', 'Elliot Stroud', 'Mattias Svanberg', 'Anthony Elanga', 'Daniel Svensson'
]);

SELECT public.add_match_appearances(12, 'Tunisia', ARRAY[
  'Abdelmouhib Chamakh', 'Ali Abdi', 'Montassar Talbi', 'Omar Rekik', 'Yan Valery',
  'Mohamed Amine Ben Hamida', 'Hannibal Mejbri', 'Rani Khedira', 'Ellyes Skhiri', 'Anis Ben Slimane', 'Elias Saad',
  'Hadj Mahmoud', 'Sebastian Tounekti', 'Elias Achouri', 'Ismael Gharbi', 'Firas Chaouat'
]);

SELECT public.refresh_five_a_side_player_stats();
