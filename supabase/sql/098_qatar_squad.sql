-- Qatar 2026 World Cup squad (26: 3 GK, 8 DF, 6 MD, 9 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Qatar';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Salah Zakaria', 'Qatar', 'gk'),
  ('Mahmoud Abunada', 'Qatar', 'gk'),
  ('Meshaal Barsham', 'Qatar', 'gk'),
  ('Hashmi Hussein', 'Qatar', 'df'),
  ('Ayoub Alawi', 'Qatar', 'df'),
  ('Boualem Khoukhi', 'Qatar', 'df'),
  ('Pedro Miguel', 'Qatar', 'df'),
  ('Issa Laaye', 'Qatar', 'df'),
  ('Lucas Mendes', 'Qatar', 'df'),
  ('Sultan Al-Brake', 'Qatar', 'df'),
  ('Homam Al-Amin', 'Qatar', 'df'),
  ('Mohammed Al-Manai', 'Qatar', 'md'),
  ('Jassem Jaber', 'Qatar', 'md'),
  ('Karim Boudiaf', 'Qatar', 'md'),
  ('Ahmed Fathi', 'Qatar', 'md'),
  ('Abdulaziz Hatem', 'Qatar', 'md'),
  ('Assim Madibo', 'Qatar', 'md'),
  ('Tahseen Mohammed', 'Qatar', 'st'),
  ('Edmilson Junior', 'Qatar', 'st'),
  ('Almoez Ali', 'Qatar', 'st'),
  ('Akram Afif', 'Qatar', 'st'),
  ('Mohammed Muntari', 'Qatar', 'st'),
  ('Youssef Abdulrazzaq', 'Qatar', 'st'),
  ('Ahmed Alaa', 'Qatar', 'st'),
  ('Hassan Al-Haydos', 'Qatar', 'st'),
  ('Ahmed Al-Janahi', 'Qatar', 'st');

SELECT public.refresh_five_a_side_player_stats();
