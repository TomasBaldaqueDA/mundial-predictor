-- Match 56: Ecuador 2-1 Germany (Group E, 25 Jun 2026)
-- Goals: Sané 2' (assist Wirtz) | Angulo 9' (assist Vite) | Plata 77' (assist Rodríguez)
-- MVP: Nilson Angulo
-- Lineups: SofaScore (Jun 25 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Nilson Angulo'
WHERE id = 56;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Leroy Sané';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Ecuador' AND name = 'Nilson Angulo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Ecuador' AND name = 'Gonzalo Plata';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Florian Wirtz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Ecuador' AND name = 'Pedro Vite';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Ecuador' AND name = 'Kevin Rodríguez';

SELECT public.add_match_appearances(56, 'Ecuador', ARRAY[
  'Hernán Galíndez', 'Piero Hincapié', 'William Pacho', 'Joel Ordonez', 'Alan Franco',
  'Nilson Angulo', 'Pedro Vite', 'Moises Caicedo', 'John Yeboah', 'Enner Valencia', 'Gonzalo Plata',
  'Ángelo Preciado', 'Kevin Rodríguez', 'Pervis Estupiñán', 'Jordy Caicedo', 'Felix Torres'
]);

SELECT public.add_match_appearances(56, 'Germany', ARRAY[
  'Manuel Neuer', 'Jonathan Tah', 'Antonio Rüdiger', 'Aleksandar Pavlovic', 'Joshua Kimmich',
  'Felix Nmecha', 'Florian Wirtz', 'David Raum', 'Leroy Sané', 'Jamal Musiala', 'Kai Havertz',
  'Angelo Stiller', 'Malick Thiaw', 'Deniz Undav', 'Maximilian Beier', 'Pascal Groß'
]);

SELECT public.refresh_five_a_side_player_stats();
