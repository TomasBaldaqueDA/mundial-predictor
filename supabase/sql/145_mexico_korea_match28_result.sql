-- Match 28: Mexico 1-0 Korea Republic (Group A, 19 Jun 2026)
-- Goals: Luis Romo 50'
-- MVP: Luis Romo
-- Lineups: SofaScore (Jun 19 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp    = 'Luis Romo'
WHERE id = 28;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Mexico' AND name = 'Luis Romo';

SELECT public.add_match_appearances(28, 'Mexico', ARRAY[
  'Raul Rangel', 'Jorge Sanchez', 'Edson Alvarez', 'Johan Vasquez', 'Jesus Gallardo',
  'Brian Gutierrez', 'Erik Lira', 'Luis Romo', 'Roberto Alvarado', 'Raul Jimenez', 'Julian Quinones',
  'Orbelin Pineda', 'Obed Vargas', 'Israel Reyes', 'Santiago Gimenez', 'Cesar Huerta'
]);

SELECT public.add_match_appearances(28, 'Korea Republic', ARRAY[
  'Kim Seung-gyu', 'Lee Han-beom', 'Kim Min-jae', 'Lee Ki-hyuk', 'Seol Young-woo',
  'Paik Seung-ho', 'Hwang In-beom', 'Kim Jin-gyu', 'Lee Jae-sung', 'Lee Kan-gin', 'Son Heung-min',
  'Hwang Hee-chan', 'Oh Hyeong-yu', 'Eom Ji-sung', 'Yang Hyun-jun', 'Cho Gue-sung'
]);

SELECT public.refresh_five_a_side_player_stats();
