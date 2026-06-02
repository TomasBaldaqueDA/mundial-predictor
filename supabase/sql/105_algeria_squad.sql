-- Algeria 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Algeria';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Luca Zidane', 'Algeria', 'gk'),
  ('Oussama Benbot', 'Algeria', 'gk'),
  ('Melvin Mastil', 'Algeria', 'gk'),
  ('Aissa Mandi', 'Algeria', 'df'),
  ('Ramy Bensebaini', 'Algeria', 'df'),
  ('Mohamed Amine Tougai', 'Algeria', 'df'),
  ('Rayan Ait-Nouri', 'Algeria', 'df'),
  ('Jaouen Hadjam', 'Algeria', 'df'),
  ('Rafik Belghali', 'Algeria', 'df'),
  ('Zineddine Belaid', 'Algeria', 'df'),
  ('Achref Abada', 'Algeria', 'df'),
  ('Samir Chergui', 'Algeria', 'df'),
  ('Nabil Bentaleb', 'Algeria', 'md'),
  ('Ramiz Zerrouki', 'Algeria', 'md'),
  ('Hicham Boudaoui', 'Algeria', 'md'),
  ('Fares Chaibi', 'Algeria', 'md'),
  ('Houssem Aouar', 'Algeria', 'md'),
  ('Ibrahim Maza', 'Algeria', 'md'),
  ('Yacine Titraoui', 'Algeria', 'md'),
  ('Riyad Mahrez', 'Algeria', 'st'),
  ('Mohamed Amoura', 'Algeria', 'st'),
  ('Amine Gouiri', 'Algeria', 'st'),
  ('Anis Hadj Moussa', 'Algeria', 'st'),
  ('Adil Boulbina', 'Algeria', 'st'),
  ('Nadhir Benbouali', 'Algeria', 'st'),
  ('Fares Ghedjemis', 'Algeria', 'st');

SELECT public.refresh_five_a_side_player_stats();
