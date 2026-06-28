-- Match 68: Croatia 2-1 Ghana (Group L, 27 Jun 2026)
-- Goals: Sucic 31' (assist Kovacic) | Luckassen 73' (assist Nuamah) | Vlasic 83' (assist Modric)
-- MVP: Petar Sucic
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Petar Sucic'
WHERE id = 68;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Petar Sucic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Ghana' AND name = 'Derrick Luckassen';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Nikola Vlasic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Croatia' AND name = 'Mateo Kovacic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Ghana' AND name = 'Ernest Nuamah';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Croatia' AND name = 'Luka Modric';

SELECT public.add_match_appearances(68, 'Croatia', ARRAY[
  'Dominik Livakovic', 'Ivan Perisic', 'Marin Pongracic', 'Josip Sutalo', 'Josip Stanisic',
  'Mateo Kovacic', 'Luka Modric', 'Martin Baturina', 'Petar Sucic', 'Nikola Vlasic', 'Ante Budimir',
  'Igor Matanovic', 'Mario Pasalic', 'Josko Gvardiol', 'Marco Pasalic'
]);

SELECT public.add_match_appearances(68, 'Ghana', ARRAY[
  'Benjamin Asare', 'Marvin Senaya', 'Jonas Adjetey', 'Derrick Luckassen', 'Gideon Mensah',
  'Thomas Partey', 'Antoine Semenyo', 'Elisha Owusu', 'Kwasi Sibo', 'Kamaldeen Sulemana', 'Jordan Ayew',
  'Kojo Oppong Peprah', 'Abdul Fatawu Issahaku', 'Brandon Thomas-Asante', 'Ernest Nuamah', 'Caleb Yirenkyi'
]);

SELECT public.refresh_five_a_side_player_stats();
