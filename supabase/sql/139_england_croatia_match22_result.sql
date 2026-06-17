-- Match 22: England 4-2 Croatia (Group L, 17 Jun 2026)
-- Goals: Kane 12' (pen) & 42' (assist Rice) | Baturina 36' (assist P. Sucic) | Musa 45+5' (assist Perisic) | Bellingham 47' (assist Anderson) | Rashford 85' (assist Saka)
-- MVP: Harry Kane
-- Lineups: SofaScore (Jun 17 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 2,
  mvp    = 'Harry Kane'
WHERE id = 22;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Marcus Rashford';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Martin Baturina';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Croatia' AND name = 'Petar Musa';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Declan Rice';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Croatia' AND name = 'Petar Sucic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Croatia' AND name = 'Ivan Perisic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Elliott Anderson';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Bukayo Saka';

SELECT public.add_match_appearances(22, 'England', ARRAY[
  'Jordan Pickford', 'Reece James', 'Ezri Konsa', 'John Stones', 'Nico O''Reilly',
  'Declan Rice', 'Elliott Anderson', 'Noni Madueke', 'Jude Bellingham', 'Anthony Gordon', 'Harry Kane',
  'Morgan Rogers', 'Marcus Rashford', 'Bukayo Saka', 'Djed Spence', 'Marc Guehi'
]);

SELECT public.add_match_appearances(22, 'Croatia', ARRAY[
  'Dominik Livakovic', 'Josko Gvardiol', 'Luka Vuskovic', 'Josip Sutalo', 'Ivan Perisic',
  'Mario Pasalic', 'Luka Modric', 'Josip Stanisic', 'Petar Sucic', 'Martin Baturina', 'Petar Musa',
  'Mateo Kovacic', 'Marco Pasalic', 'Igor Matanovic', 'Andrej Kramaric', 'Nikola Vlasic'
]);

SELECT public.refresh_five_a_side_player_stats();
