-- Australia 2026 World Cup squad (26: 3 GK, 10 DF, 6 MD, 7 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Australia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Maty Ryan', 'Australia', 'gk'),
  ('Paul Izzo', 'Australia', 'gk'),
  ('Patrick Beach', 'Australia', 'gk'),
  ('Aziz Behich', 'Australia', 'df'),
  ('Jordan Bos', 'Australia', 'df'),
  ('Cameron Burgess', 'Australia', 'df'),
  ('Alessandro Circati', 'Australia', 'df'),
  ('Milos Degenek', 'Australia', 'df'),
  ('Jason Geria', 'Australia', 'df'),
  ('Lucas Herrington', 'Australia', 'df'),
  ('Jacob Italiano', 'Australia', 'df'),
  ('Harry Souttar', 'Australia', 'df'),
  ('Kai Trewin', 'Australia', 'df'),
  ('Cameron Devlin', 'Australia', 'md'),
  ('Ajdin Hrustic', 'Australia', 'md'),
  ('Jackson Irvine', 'Australia', 'md'),
  ('Connor Metcalfe', 'Australia', 'md'),
  ('Aiden O''Neill', 'Australia', 'md'),
  ('Paul Okon-Engstler', 'Australia', 'md'),
  ('Nestory Irankunda', 'Australia', 'st'),
  ('Mathew Leckie', 'Australia', 'st'),
  ('Awer Mabil', 'Australia', 'st'),
  ('Mohamed Toure', 'Australia', 'st'),
  ('Nishan Velupillay', 'Australia', 'st'),
  ('Cristian Volpato', 'Australia', 'st'),
  ('Tete Yengi', 'Australia', 'st');

SELECT public.refresh_five_a_side_player_stats();
