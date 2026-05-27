-- Scotland 2026 World Cup squad (26: 3 GK, 10 DF, 8 MD, 5 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Scotland';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Craig Gordon', 'Scotland', 'gk'),
  ('Angus Gunn', 'Scotland', 'gk'),
  ('Liam Kelly', 'Scotland', 'gk'),
  ('Grant Hanley', 'Scotland', 'df'),
  ('Jack Hendry', 'Scotland', 'df'),
  ('Aaron Hickey', 'Scotland', 'df'),
  ('Dom Hyam', 'Scotland', 'df'),
  ('Scott McKenna', 'Scotland', 'df'),
  ('Nathan Patterson', 'Scotland', 'df'),
  ('Anthony Ralston', 'Scotland', 'df'),
  ('Andy Robertson', 'Scotland', 'df'),
  ('John Souttar', 'Scotland', 'df'),
  ('Kieran Tierney', 'Scotland', 'df'),
  ('Ryan Christie', 'Scotland', 'md'),
  ('Findlay Curtis', 'Scotland', 'md'),
  ('Lewis Ferguson', 'Scotland', 'md'),
  ('Ben Gannon-Doak', 'Scotland', 'md'),
  ('Billy Gilmour', 'Scotland', 'md'),
  ('John McGinn', 'Scotland', 'md'),
  ('Kenny McLean', 'Scotland', 'md'),
  ('Scott McTominay', 'Scotland', 'md'),
  ('Che Adams', 'Scotland', 'st'),
  ('Lyndon Dykes', 'Scotland', 'st'),
  ('George Hirst', 'Scotland', 'st'),
  ('Lawrence Shankland', 'Scotland', 'st'),
  ('Ross Stewart', 'Scotland', 'st');

SELECT public.refresh_five_a_side_player_stats();
