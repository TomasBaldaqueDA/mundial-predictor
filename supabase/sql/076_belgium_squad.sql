-- Belgium 2026 World Cup squad (26: 3 GK, 9 DF, 6 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Belgium';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Thibaut Courtois', 'Belgium', 'gk'),
  ('Senne Lammens', 'Belgium', 'gk'),
  ('Mike Penders', 'Belgium', 'gk'),
  ('Timothy Castagne', 'Belgium', 'df'),
  ('Zeno Debast', 'Belgium', 'df'),
  ('Maxim De Cuyper', 'Belgium', 'df'),
  ('Koni De Winter', 'Belgium', 'df'),
  ('Brandon Mechele', 'Belgium', 'df'),
  ('Thomas Meunier', 'Belgium', 'df'),
  ('Nathan Ngoy', 'Belgium', 'df'),
  ('Joaquin Seys', 'Belgium', 'df'),
  ('Arthur Theate', 'Belgium', 'df'),
  ('Kevin De Bruyne', 'Belgium', 'md'),
  ('Amadou Onana', 'Belgium', 'md'),
  ('Nicolas Raskin', 'Belgium', 'md'),
  ('Youri Tielemans', 'Belgium', 'md'),
  ('Hans Vanaken', 'Belgium', 'md'),
  ('Axel Witsel', 'Belgium', 'md'),
  ('Charles De Ketelaere', 'Belgium', 'st'),
  ('Jeremy Doku', 'Belgium', 'st'),
  ('Matias Fernandez-Pardo', 'Belgium', 'st'),
  ('Romelu Lukaku', 'Belgium', 'st'),
  ('Dodi Lukebakio', 'Belgium', 'st'),
  ('Diego Moreira', 'Belgium', 'st'),
  ('Alexis Saelemaekers', 'Belgium', 'st'),
  ('Leandro Trossard', 'Belgium', 'st');

SELECT public.refresh_five_a_side_player_stats();
