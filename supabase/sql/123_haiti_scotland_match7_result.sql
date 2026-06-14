-- Match 7: Haiti 0-1 Scotland (Group C, 14 Jun 2026)
-- Goal: John McGinn 28'
-- MVP: John McGinn

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'John McGinn'
WHERE id = 7;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Scotland' AND name = 'John McGinn';

SELECT public.add_match_appearances(7, 'Haiti', ARRAY[
  'Johnny Placide', 'Carlens Arcus', 'Ricardo Ade', 'Hannes Delcroix', 'Martin Experience',
  'Louicius Deedson', 'Jean-Jacques Danley', 'Jeanricner Bellegarde', 'Ruben Providence',
  'Frantzdy Pierrot', 'Wilson Isidor', 'Josué Casimir', 'Lenny Joseph', 'Yassin Fortune'
]);

SELECT public.add_match_appearances(7, 'Scotland', ARRAY[
  'Angus Gunn', 'Andy Robertson', 'Jack Hendry', 'Grant Hanley', 'Aaron Hickey',
  'Lewis Ferguson', 'John McGinn', 'Scott McTominay', 'Ben Gannon-Doak', 'Che Adams', 'Lawrence Shankland',
  'Ryan Christie', 'Lyndon Dykes', 'Nathan Patterson', 'Findlay Curtis', 'Kenny McLean'
]);

SELECT public.refresh_five_a_side_player_stats();
