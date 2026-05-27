-- Ghana 2026 World Cup preliminary squad (28: 5 GK, 9 DF, 7 MD, 7 ST). May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Ghana';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Lawrence Ati-Zigi', 'Ghana', 'gk'),
  ('Benjamin Asare', 'Ghana', 'gk'),
  ('Solomon Agbasi', 'Ghana', 'gk'),
  ('Joseph Anang', 'Ghana', 'gk'),
  ('Paul Reverson', 'Ghana', 'gk'),
  ('Jonas Adjetey', 'Ghana', 'df'),
  ('Abdul Rahman Baba', 'Ghana', 'df'),
  ('Alexander Djiku', 'Ghana', 'df'),
  ('Gideon Mensah', 'Ghana', 'df'),
  ('Abdul Mumin', 'Ghana', 'df'),
  ('Jerome Opoku', 'Ghana', 'df'),
  ('Kojo Peprah Oppong', 'Ghana', 'df'),
  ('Alidu Seidu', 'Ghana', 'df'),
  ('Marvin Senaya', 'Ghana', 'df'),
  ('Augustine Boakye', 'Ghana', 'md'),
  ('Abdul Fatawu', 'Ghana', 'md'),
  ('Elisha Owusu', 'Ghana', 'md'),
  ('Thomas Partey', 'Ghana', 'md'),
  ('Kwasi Sibo', 'Ghana', 'md'),
  ('Kamaldeen Sulemana', 'Ghana', 'md'),
  ('Caleb Yirenkyi', 'Ghana', 'md'),
  ('Jordan Ayew', 'Ghana', 'st'),
  ('Christopher Bonsu Baah', 'Ghana', 'st'),
  ('Prince Kwabena Adu', 'Ghana', 'st'),
  ('Ernest Nuamah', 'Ghana', 'st'),
  ('Antoine Semenyo', 'Ghana', 'st'),
  ('Brandon Thomas-Asante', 'Ghana', 'st'),
  ('Inaki Williams', 'Ghana', 'st');

SELECT public.refresh_five_a_side_player_stats();
