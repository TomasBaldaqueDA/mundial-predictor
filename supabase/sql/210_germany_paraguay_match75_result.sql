-- Match 75: Germany 1-1 Paraguay, PSO 3-4 (Round of 32, 29 Jun 2026 — 1E vs 3D)
-- Goals: Enciso 42' (assist Galarza) | Havertz 54' (assist Wirtz)
-- MVP: Orlando Gill
-- Paraguay advances to Round of 16 (match 89 team1 = W74, FIFA M74)
-- Lineups: SofaScore (Jun 29 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Orlando Gill',
  qualifier = 'Paraguay'
WHERE id = 75;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Germany' AND name = 'Kai Havertz';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Paraguay' AND name = 'Julio Enciso';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Germany' AND name = 'Florian Wirtz';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Paraguay' AND name = 'Matias Galarza';

UPDATE public.matches SET team1 = 'Paraguay'
WHERE id = 89 AND stage = 'Round of 16';

SELECT public.add_match_appearances(75, 'Germany', ARRAY[
  'Manuel Neuer', 'Joshua Kimmich', 'Jonathan Tah', 'Antonio Rüdiger', 'Nathaniel Brown',
  'Aleksandar Pavlovic', 'Felix Nmecha', 'Leroy Sané', 'Florian Wirtz', 'Kai Havertz', 'Deniz Undav',
  'Leon Goretzka', 'Jamal Musiala', 'Waldemar Anton', 'Nick Woltemade', 'Malick Thiaw', 'Nadiem Amiri'
]);

SELECT public.add_match_appearances(75, 'Paraguay', ARRAY[
  'Orlando Gill', 'Junior Alonso', 'Jose Canale', 'Gustavo Gomez', 'Juan Jose Caceres',
  'Matias Galarza', 'Andres Cubas', 'Damian Bobadilla', 'Miguel Almiron', 'Julio Enciso', 'Gabriel Avalos',
  'Gustavo Caballero', 'Mauricio Magalhaes', 'Gustavo Velazquez', 'Briaian Ojeda', 'Antonio Sanabria', 'Fabian Balbuena'
]);

SELECT public.refresh_five_a_side_player_stats();
