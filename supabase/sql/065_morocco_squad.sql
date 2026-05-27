-- Morocco 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Morocco';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Yassine Bounou', 'Morocco', 'gk'),
  ('Munir El Kajoui', 'Morocco', 'gk'),
  ('Reda Tagnaouti', 'Morocco', 'gk'),
  ('Noussair Mazraoui', 'Morocco', 'df'),
  ('Anass Salah-Eddine', 'Morocco', 'df'),
  ('Youssef Belammari', 'Morocco', 'df'),
  ('Achraf Hakimi', 'Morocco', 'df'),
  ('Zakaria El Ouahdi', 'Morocco', 'df'),
  ('Nayef Aguerd', 'Morocco', 'df'),
  ('Chadi Riad', 'Morocco', 'df'),
  ('Redouane Halhal', 'Morocco', 'df'),
  ('Issa Diop', 'Morocco', 'df'),
  ('Samir El Mourabet', 'Morocco', 'md'),
  ('Ayyoub Bouaddi', 'Morocco', 'md'),
  ('Neil El Aynaoui', 'Morocco', 'md'),
  ('Sofyan Amrabat', 'Morocco', 'md'),
  ('Azzedine Ounahi', 'Morocco', 'md'),
  ('Bilal El Khannouss', 'Morocco', 'md'),
  ('Ismael Saibari', 'Morocco', 'md'),
  ('Abde Ezzalzouli', 'Morocco', 'st'),
  ('Chemsdine Talbi', 'Morocco', 'st'),
  ('Soufiane Rahimi', 'Morocco', 'st'),
  ('Ayoub El Kaabi', 'Morocco', 'st'),
  ('Brahim Diaz', 'Morocco', 'st'),
  ('Gessime Yassine', 'Morocco', 'st'),
  ('Ayoube Amaimouni', 'Morocco', 'st');

SELECT public.refresh_five_a_side_player_stats();
