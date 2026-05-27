-- Côte d'Ivoire 2026 World Cup squad (26: 3 GK, 8 DF, 6 MD, 9 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Côte d''Ivoire';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Yahia Fofana', 'Côte d''Ivoire', 'gk'),
  ('Mohamed Kone', 'Côte d''Ivoire', 'gk'),
  ('Alban Lafont', 'Côte d''Ivoire', 'gk'),
  ('Emmanuel Agbadou', 'Côte d''Ivoire', 'df'),
  ('Clement Akpa', 'Côte d''Ivoire', 'df'),
  ('Ousmane Diomande', 'Côte d''Ivoire', 'df'),
  ('Guela Doué', 'Côte d''Ivoire', 'df'),
  ('Ghislain Konan', 'Côte d''Ivoire', 'df'),
  ('Odilon Kossounou', 'Côte d''Ivoire', 'df'),
  ('Evan Ndicka', 'Côte d''Ivoire', 'df'),
  ('Wilfried Singo', 'Côte d''Ivoire', 'df'),
  ('Seko Fofana', 'Côte d''Ivoire', 'md'),
  ('Parfait Guiagon', 'Côte d''Ivoire', 'md'),
  ('Christ Inao Oulai', 'Côte d''Ivoire', 'md'),
  ('Franck Kessie', 'Côte d''Ivoire', 'md'),
  ('Ibrahim Sangare', 'Côte d''Ivoire', 'md'),
  ('Jean-Michael Seri', 'Côte d''Ivoire', 'md'),
  ('Simon Adingra', 'Côte d''Ivoire', 'st'),
  ('Ange-Yoan Bonny', 'Côte d''Ivoire', 'st'),
  ('Amad Diallo', 'Côte d''Ivoire', 'st'),
  ('Oumar Diakite', 'Côte d''Ivoire', 'st'),
  ('Yan Diomande', 'Côte d''Ivoire', 'st'),
  ('Evann Guessand', 'Côte d''Ivoire', 'st'),
  ('Nicolas Pepe', 'Côte d''Ivoire', 'st'),
  ('Bazoumana Toure', 'Côte d''Ivoire', 'st'),
  ('Elye Wahi', 'Côte d''Ivoire', 'st');

SELECT public.refresh_five_a_side_player_stats();
