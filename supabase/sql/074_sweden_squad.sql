-- Sweden 2026 World Cup squad (25: 4 GK, 7 DF, 8 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Sweden';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Viktor Johansson', 'Sweden', 'gk'),
  ('Gustaf Lagerbielke', 'Sweden', 'gk'),
  ('Kristoffer Nordfeldt', 'Sweden', 'gk'),
  ('Jacob Zetterstrom', 'Sweden', 'gk'),
  ('Hjalmar Ekdal', 'Sweden', 'df'),
  ('Gabriel Gudmundsson', 'Sweden', 'df'),
  ('Isak Hien', 'Sweden', 'df'),
  ('Victor Lindelof', 'Sweden', 'df'),
  ('Eric Smith', 'Sweden', 'df'),
  ('Carl Starfelt', 'Sweden', 'df'),
  ('Daniel Svensson', 'Sweden', 'df'),
  ('Yasin Ayari', 'Sweden', 'md'),
  ('Lucas Bergvall', 'Sweden', 'md'),
  ('Jesper Karlstrom', 'Sweden', 'md'),
  ('Benjamin Nygren', 'Sweden', 'md'),
  ('Ken Sema', 'Sweden', 'md'),
  ('Elliot Stroud', 'Sweden', 'md'),
  ('Mattias Svanberg', 'Sweden', 'md'),
  ('Besfort Zeneli', 'Sweden', 'md'),
  ('Taha Ali', 'Sweden', 'st'),
  ('Alexander Bernhardsson', 'Sweden', 'st'),
  ('Anthony Elanga', 'Sweden', 'st'),
  ('Viktor Gyokeres', 'Sweden', 'st'),
  ('Alexander Isak', 'Sweden', 'st'),
  ('Gustaf Nilsson', 'Sweden', 'st');

SELECT public.refresh_five_a_side_player_stats();
