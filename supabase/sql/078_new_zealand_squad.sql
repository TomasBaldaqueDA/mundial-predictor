-- New Zealand 2026 World Cup squad (26: 3 GK, 9 DF, 10 MD, 4 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'New Zealand';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Max Crocombe', 'New Zealand', 'gk'),
  ('Alex Paulsen', 'New Zealand', 'gk'),
  ('Michael Woud', 'New Zealand', 'gk'),
  ('Tyler Bindon', 'New Zealand', 'df'),
  ('Michael Boxall', 'New Zealand', 'df'),
  ('Liberato Cacace', 'New Zealand', 'df'),
  ('Francis de Vries', 'New Zealand', 'df'),
  ('Callan Elliot', 'New Zealand', 'df'),
  ('Tim Payne', 'New Zealand', 'df'),
  ('Nando Pijnaker', 'New Zealand', 'df'),
  ('Tommy Smith', 'New Zealand', 'df'),
  ('Finn Surman', 'New Zealand', 'df'),
  ('Lachlan Bayliss', 'New Zealand', 'md'),
  ('Joe Bell', 'New Zealand', 'md'),
  ('Matt Garbett', 'New Zealand', 'md'),
  ('Eli Just', 'New Zealand', 'md'),
  ('Callum McCowatt', 'New Zealand', 'md'),
  ('Ben Old', 'New Zealand', 'md'),
  ('Alex Rufer', 'New Zealand', 'md'),
  ('Marko Stamenic', 'New Zealand', 'md'),
  ('Sarpreet Singh', 'New Zealand', 'md'),
  ('Ryan Thomas', 'New Zealand', 'md'),
  ('Kosta Barbarouses', 'New Zealand', 'st'),
  ('Jesse Randall', 'New Zealand', 'st'),
  ('Ben Waine', 'New Zealand', 'st'),
  ('Chris Wood', 'New Zealand', 'st');

SELECT public.refresh_five_a_side_player_stats();
