-- Germany 2026 World Cup squad (26: 3 GK, 8 DF, 9 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Germany';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Manuel Neuer', 'Germany', 'gk'),
  ('Oliver Baumann', 'Germany', 'gk'),
  ('Alexander Nübel', 'Germany', 'gk'),
  ('Joshua Kimmich', 'Germany', 'df'),
  ('Nathaniel Brown', 'Germany', 'df'),
  ('Antonio Rüdiger', 'Germany', 'df'),
  ('Nico Schlotterbeck', 'Germany', 'df'),
  ('Jonathan Tah', 'Germany', 'df'),
  ('David Raum', 'Germany', 'df'),
  ('Waldemar Anton', 'Germany', 'df'),
  ('Malick Thiaw', 'Germany', 'df'),
  ('Aleksandar Pavlovic', 'Germany', 'md'),
  ('Leon Goretzka', 'Germany', 'md'),
  ('Nadiem Amiri', 'Germany', 'md'),
  ('Jamal Musiala', 'Germany', 'md'),
  ('Florian Wirtz', 'Germany', 'md'),
  ('Lennart Karl', 'Germany', 'md'),
  ('Angelo Stiller', 'Germany', 'md'),
  ('Felix Nmecha', 'Germany', 'md'),
  ('Pascal Groß', 'Germany', 'md'),
  ('Deniz Undav', 'Germany', 'st'),
  ('Kai Havertz', 'Germany', 'st'),
  ('Jamie Leweling', 'Germany', 'st'),
  ('Nick Woltemade', 'Germany', 'st'),
  ('Maximilian Beier', 'Germany', 'st'),
  ('Leroy Sané', 'Germany', 'st');

SELECT public.refresh_five_a_side_player_stats();
