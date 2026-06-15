-- Match 11: Côte d'Ivoire 1-0 Ecuador (Group E, 15 Jun 2026)
-- Goal: Diallo 90' (assist Singo)
-- MVP: Yan Diomande

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp    = 'Yan Diomande'
WHERE id = 11;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Amad Diallo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Wilfried Singo';

SELECT public.add_match_appearances(11, 'Côte d''Ivoire', ARRAY[
  'Yahia Fofana', 'Guela Doué', 'Wilfried Singo', 'Emmanuel Agbadou', 'Ghislain Konan',
  'Yan Diomande', 'Franck Kessie', 'Seko Fofana', 'Bazoumana Toure', 'Nicolas Pepe', 'Elye Wahi',
  'Ange-Yoan Bonny', 'Amad Diallo', 'Ibrahim Sangare', 'Christ Inao Oulai', 'Odilon Kossounou'
]);

SELECT public.add_match_appearances(11, 'Ecuador', ARRAY[
  'Hernán Galíndez', 'Joel Ordonez', 'Piero Hincapié', 'William Pacho', 'Alan Minda',
  'Alan Franco', 'Moises Caicedo', 'Pedro Vite', 'Gonzalo Plata', 'Enner Valencia', 'John Yeboah',
  'Ángelo Preciado', 'Jackson Porozo', 'Kevin Rodríguez'
]);

SELECT public.refresh_five_a_side_player_stats();
