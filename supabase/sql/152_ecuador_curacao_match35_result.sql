-- Match 35: Ecuador 0-0 Curaçao (Group E, 21 Jun 2026)
-- MVP: Eloy Room
-- Lineups: SofaScore (Jun 21 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Eloy Room'
WHERE id = 35;

SELECT public.add_match_appearances(35, 'Ecuador', ARRAY[
  'Hernán Galíndez', 'William Pacho', 'Jordy Alcivar', 'Alan Franco', 'Moises Caicedo',
  'Piero Hincapié', 'Pervis Estupiñán', 'Pedro Vite', 'John Yeboah', 'Enner Valencia', 'Gonzalo Plata',
  'Kevin Rodríguez', 'Nelson Angulo', 'Ángelo Preciado', 'Jordy Caicedo'
]);

SELECT public.add_match_appearances(35, 'Curaçao', ARRAY[
  'Eloy Room', 'Joshua Brenet', 'Jurien Gaari', 'Armando Obispo', 'Sherel Floranus', 'Roshon Van Eijma',
  'Tahith Chong', 'Livano Comenencia', 'Leandro Bacuna', 'Kenji Gorré', 'Jurgen Locadia',
  'Juninho Bacuna', 'Deveron Fonville', 'Jearl Margaritha', 'Gervane Kastaneer', 'Godfried Roemeratoe'
]);

SELECT public.refresh_five_a_side_player_stats();
