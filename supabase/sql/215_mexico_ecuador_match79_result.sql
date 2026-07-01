-- Match 79: Mexico 2-0 Ecuador (Round of 32, 1 Jul 2026 — 1A vs 3E)
-- Goals: Quinones 22' (assist Alvarado) | Jimenez 31' (assist Quinones)
-- MVP: Julian Quinones
-- Mexico advances to Round of 16 (match 92 team1 = W79)
-- Lineups: SofaScore (Jul 1 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp       = 'Julian Quinones',
  qualifier = 'Mexico'
WHERE id = 79;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Julian Quinones';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Raul Jimenez';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Roberto Alvarado';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Mexico' AND name = 'Julian Quinones';

UPDATE public.matches SET team1 = 'Mexico'
WHERE id = 92 AND stage = 'Round of 16';

SELECT public.add_match_appearances(79, 'Mexico', ARRAY[
  'Raul Rangel', 'Jorge Sanchez', 'Cesar Montes', 'Johan Vasquez', 'Jesus Gallardo',
  'Gilberto Mora', 'Erik Lira', 'Luis Romo', 'Roberto Alvarado', 'Raul Jimenez', 'Julian Quinones',
  'Brian Gutierrez', 'Obed Vargas', 'Santiago Gimenez', 'Israel Reyes', 'Orbelin Pineda'
]);

SELECT public.add_match_appearances(79, 'Ecuador', ARRAY[
  'Hernán Galíndez', 'Piero Hincapié', 'William Pacho', 'Yaimar Medina', 'Ángelo Preciado',
  'Nilson Angulo', 'Pedro Vite', 'Moises Caicedo', 'John Yeboah', 'Enner Valencia', 'Gonzalo Plata',
  'Alan Franco', 'Joel Ordonez', 'Kevin Rodríguez', 'Kendry Páez', 'Jordy Caicedo'
]);

SELECT public.refresh_five_a_side_player_stats();
