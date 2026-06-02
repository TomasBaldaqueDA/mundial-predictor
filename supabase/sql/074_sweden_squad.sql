-- Sweden 2026 World Cup final squad (26: 3 GK, 10 DF, 7 MD, 6 ST). June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Sweden';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Viktor Johansson', 'Sweden', 'gk'),
  ('Kristoffer Nordfeldt', 'Sweden', 'gk'),
  ('Jacob Widell Zetterstrom', 'Sweden', 'gk'),
  ('Hjalmar Ekdal', 'Sweden', 'df'),
  ('Gabriel Gudmundsson', 'Sweden', 'df'),
  ('Isak Hien', 'Sweden', 'df'),
  ('Emil Holm', 'Sweden', 'df'),
  ('Gustaf Lagerbielke', 'Sweden', 'df'),
  ('Victor Lindelof', 'Sweden', 'df'),
  ('Erik Smith', 'Sweden', 'df'),
  ('Carl Starfelt', 'Sweden', 'df'),
  ('Elliot Stroud', 'Sweden', 'df'),
  ('Daniel Svensson', 'Sweden', 'df'),
  ('Taha Ali', 'Sweden', 'md'),
  ('Yasin Ayari', 'Sweden', 'md'),
  ('Lucas Bergvall', 'Sweden', 'md'),
  ('Jesper Karlstrom', 'Sweden', 'md'),
  ('Ken Sema', 'Sweden', 'md'),
  ('Mattias Svanberg', 'Sweden', 'md'),
  ('Besfort Zeneli', 'Sweden', 'md'),
  ('Alexander Bernhardsson', 'Sweden', 'st'),
  ('Anthony Elanga', 'Sweden', 'st'),
  ('Viktor Gyokeres', 'Sweden', 'st'),
  ('Alexander Isak', 'Sweden', 'st'),
  ('Gustaf Nilsson', 'Sweden', 'st'),
  ('Benjamin Nygren', 'Sweden', 'st');

SELECT public.refresh_five_a_side_player_stats();
