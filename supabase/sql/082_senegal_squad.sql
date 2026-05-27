-- Senegal 2026 World Cup squad (28: 3 GK, 10 DF, 7 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Senegal';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Édouard Mendy', 'Senegal', 'gk'),
  ('Mory Diaw', 'Senegal', 'gk'),
  ('Yehvann Diouf', 'Senegal', 'gk'),
  ('Krépin Diatta', 'Senegal', 'df'),
  ('Antoine Mendy', 'Senegal', 'df'),
  ('Kalidou Koulibaly', 'Senegal', 'df'),
  ('El Hadji Malick Diouf', 'Senegal', 'df'),
  ('Mamadou Sarr', 'Senegal', 'df'),
  ('Moussa Niakhaté', 'Senegal', 'df'),
  ('Moustapha Mbow', 'Senegal', 'df'),
  ('Abdoulaye Seck', 'Senegal', 'df'),
  ('Ismaïl Jakobs', 'Senegal', 'df'),
  ('Ilay Camara', 'Senegal', 'df'),
  ('Idrissa Gana Gueye', 'Senegal', 'md'),
  ('Pape Gueye', 'Senegal', 'md'),
  ('Lamine Camara', 'Senegal', 'md'),
  ('Habib Diarra', 'Senegal', 'md'),
  ('Pathé Ciss', 'Senegal', 'md'),
  ('Pape Matar Sarr', 'Senegal', 'md'),
  ('Bara Sapoko Ndiaye', 'Senegal', 'md'),
  ('Sadio Mané', 'Senegal', 'st'),
  ('Ismaïla Sarr', 'Senegal', 'st'),
  ('Iliman Ndiaye', 'Senegal', 'st'),
  ('Assane Diao', 'Senegal', 'st'),
  ('Ibrahim Mbaye', 'Senegal', 'st'),
  ('Nicolas Jackson', 'Senegal', 'st'),
  ('Bamba Dieng', 'Senegal', 'st'),
  ('Chérif Ndiaye', 'Senegal', 'st');

SELECT public.refresh_five_a_side_player_stats();
