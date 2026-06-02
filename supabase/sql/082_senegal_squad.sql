-- Senegal 2026 World Cup final squad (26: 3 GK, 8 DF, 7 MD, 8 ST). June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Senegal';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Edouard Mendy', 'Senegal', 'gk'),
  ('Mory Diaw', 'Senegal', 'gk'),
  ('Yehvann Diouf', 'Senegal', 'gk'),
  ('Kalidou Koulibaly', 'Senegal', 'df'),
  ('Moussa Niakhate', 'Senegal', 'df'),
  ('Mamadou Sarr', 'Senegal', 'df'),
  ('Abdoulaye Seck', 'Senegal', 'df'),
  ('Krepin Diatta', 'Senegal', 'df'),
  ('Antoine Mendy', 'Senegal', 'df'),
  ('Ismail Jakobs', 'Senegal', 'df'),
  ('El Hadji Malick Diouf', 'Senegal', 'df'),
  ('Idrissa Gana Gueye', 'Senegal', 'md'),
  ('Lamine Camara', 'Senegal', 'md'),
  ('Pape Gueye', 'Senegal', 'md'),
  ('Pape Matar Sarr', 'Senegal', 'md'),
  ('Habib Diarra', 'Senegal', 'md'),
  ('Bara Sapoko Ndiaye', 'Senegal', 'md'),
  ('Pathe Ciss', 'Senegal', 'md'),
  ('Sadio Mane', 'Senegal', 'st'),
  ('Ismaila Sarr', 'Senegal', 'st'),
  ('Iliman Ndiaye', 'Senegal', 'st'),
  ('Nicolas Jackson', 'Senegal', 'st'),
  ('Cherif Ndiaye', 'Senegal', 'st'),
  ('Bamba Dieng', 'Senegal', 'st'),
  ('Ibrahim Mbaye', 'Senegal', 'st'),
  ('Assane Diao', 'Senegal', 'st');

SELECT public.refresh_five_a_side_player_stats();
