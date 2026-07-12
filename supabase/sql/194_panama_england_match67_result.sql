-- Match 67: Panama 0-2 England (Group L, 27 Jun 2026)
-- Goals: Bellingham 62' (assist Saka) | Kane 67' (assist Bellingham)
-- MVP: Jude Bellingham
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 2,
  mvp    = 'Jude Bellingham'
WHERE id = 67;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Bukayo Saka';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Jude Bellingham';

SELECT public.add_match_appearances(67, 'Panama', ARRAY[
  'Orlando Mosquera', 'Andres Andrade', 'Fidel Escobar', 'Jose Cordoba', 'Amir Murillo',
  'Carlos Harvey', 'Cristian Martinez', 'Ismael Diaz', 'Jose Fajardo', 'Azarias Londono', 'Alberto Quintero',
  'Tomas Rodriguez', 'Jose Luis Rodriguez', 'Yoel Barcenas', 'Eric Davis', 'Jorge Gutierrez'
]);

SELECT public.add_match_appearances(67, 'England', ARRAY[
  'Jordan Pickford', 'Nico O''Reilly', 'Ezri Konsa', 'Marc Guehi', 'Jarell Quansah',
  'Elliott Anderson', 'Bukayo Saka', 'Morgan Rogers', 'Jude Bellingham', 'Marcus Rashford', 'Harry Kane',
  'Djed Spence', 'Noni Madueke', 'Eberechi Eze', 'Jordan Henderson', 'Ollie Watkins'
]);

SELECT public.refresh_five_a_side_player_stats();
