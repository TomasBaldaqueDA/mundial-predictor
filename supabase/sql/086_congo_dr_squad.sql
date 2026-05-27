-- Congo DR 2026 World Cup squad (26: 3 GK, 9 DF, 9 MD, 5 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Congo DR';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Lionel Mpasi', 'Congo DR', 'gk'),
  ('Thimothy Fayulu', 'Congo DR', 'gk'),
  ('Matthieu Epolo', 'Congo DR', 'gk'),
  ('Chancel Mbemba', 'Congo DR', 'df'),
  ('Aaron Wan-Bissaka', 'Congo DR', 'df'),
  ('Alex Tuanzebe', 'Congo DR', 'df'),
  ('Arthur Masuaku', 'Congo DR', 'df'),
  ('Joris Kayembe', 'Congo DR', 'df'),
  ('Steve Kapuadi', 'Congo DR', 'df'),
  ('Aaron Tshibola', 'Congo DR', 'df'),
  ('Dylan Batubinsika', 'Congo DR', 'df'),
  ('Gédéon Kalulu', 'Congo DR', 'df'),
  ('Noah Sadiki', 'Congo DR', 'md'),
  ('Samuel Moutoussamy', 'Congo DR', 'md'),
  ('Edo Kayembe', 'Congo DR', 'md'),
  ('Ngal''ayel Mukau', 'Congo DR', 'md'),
  ('Charles Pickel', 'Congo DR', 'md'),
  ('Nathanael Mbuku', 'Congo DR', 'md'),
  ('Brian Cipenga', 'Congo DR', 'md'),
  ('Meschack Elia', 'Congo DR', 'md'),
  ('Gael Kakuta', 'Congo DR', 'md'),
  ('Theo Bongonda', 'Congo DR', 'st'),
  ('Fiston Mayele', 'Congo DR', 'st'),
  ('Cedric Bakambu', 'Congo DR', 'st'),
  ('Simon Banza', 'Congo DR', 'st'),
  ('Yoane Wissa', 'Congo DR', 'st');

SELECT public.refresh_five_a_side_player_stats();
