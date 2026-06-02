-- Ghana 2026 World Cup final squad (26: 3 GK, 9 DF, 7 MD, 7 ST). June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Ghana';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Benjamin Asare', 'Ghana', 'gk'),
  ('Lawrence Ati-Zigi', 'Ghana', 'gk'),
  ('Joseph Anang', 'Ghana', 'gk'),
  ('Baba Abdul Rahman', 'Ghana', 'df'),
  ('Gideon Mensah', 'Ghana', 'df'),
  ('Marvin Senaya', 'Ghana', 'df'),
  ('Alidu Seidu', 'Ghana', 'df'),
  ('Abdul Mumin', 'Ghana', 'df'),
  ('Jerome Opoku', 'Ghana', 'df'),
  ('Jonas Adjetey', 'Ghana', 'df'),
  ('Kojo Oppong Peprah', 'Ghana', 'df'),
  ('Derrick Luckassen', 'Ghana', 'df'),
  ('Elisha Owusu', 'Ghana', 'md'),
  ('Thomas Partey', 'Ghana', 'md'),
  ('Kwasi Sibo', 'Ghana', 'md'),
  ('Augustine Boakye', 'Ghana', 'md'),
  ('Caleb Yirenkyi', 'Ghana', 'md'),
  ('Abdul Fatawu Issahaku', 'Ghana', 'md'),
  ('Kamaldeen Sulemana', 'Ghana', 'md'),
  ('Christopher Bonsu Baah', 'Ghana', 'st'),
  ('Ernest Nuamah', 'Ghana', 'st'),
  ('Antoine Semenyo', 'Ghana', 'st'),
  ('Brandon Thomas-Asante', 'Ghana', 'st'),
  ('Prince Kwabena Adu', 'Ghana', 'st'),
  ('Inaki Williams', 'Ghana', 'st'),
  ('Jordan Ayew', 'Ghana', 'st');

SELECT public.refresh_five_a_side_player_stats();
