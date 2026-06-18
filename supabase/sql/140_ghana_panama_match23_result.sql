-- Match 23: Ghana 1-0 Panama (Group L, 18 Jun 2026)
-- Goal: Yirenkyi 90+5'
-- MVP: Antoine Semenyo
-- Lineups: SofaScore (Jun 18 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp    = 'Antoine Semenyo'
WHERE id = 23;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Ghana' AND name = 'Caleb Yirenkyi';

SELECT public.add_match_appearances(23, 'Ghana', ARRAY[
  'Lawrence Ati-Zigi', 'Jonas Adjetey', 'Caleb Yirenkyi', 'Marvin Senaya', 'Jerome Opoku',
  'Elisha Owusu', 'Ernest Nuamah', 'Kamaldeen Sulemana', 'Jordan Ayew', 'Gideon Mensah', 'Antoine Semenyo',
  'Benjamin Asare', 'Brandon Thomas-Asante', 'Abdul Fatawu Issahaku', 'Kwasi Sibo', 'Prince Kwabena Adu'
]);

SELECT public.add_match_appearances(23, 'Panama', ARRAY[
  'Orlando Mosquera', 'Jose Cordoba', 'Andres Andrade', 'Cesar Blackman', 'Yoel Barcenas',
  'Carlos Harvey', 'Amir Murillo', 'Jiovany Ramos', 'Jose Luis Rodriguez', 'Cecilio Waterman', 'Cristian Martinez',
  'Jose Fajardo', 'Azarias Londono', 'Ismael Diaz', 'Anibal Godoy'
]);

SELECT public.refresh_five_a_side_player_stats();
