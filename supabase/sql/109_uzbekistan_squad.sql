-- Uzbekistan 2026 World Cup squad (26: 3 GK, 10 DF, 10 MD, 3 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Uzbekistan';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Utkir Yusupov', 'Uzbekistan', 'gk'),
  ('Abduvohid Nematov', 'Uzbekistan', 'gk'),
  ('Botirali Ergashev', 'Uzbekistan', 'gk'),
  ('Rustam Ashurmatov', 'Uzbekistan', 'df'),
  ('Farrukh Sayfiev', 'Uzbekistan', 'df'),
  ('Khojiakbar Alijonov', 'Uzbekistan', 'df'),
  ('Sherzod Nasrullaev', 'Uzbekistan', 'df'),
  ('Umar Eshmurodov', 'Uzbekistan', 'df'),
  ('Abdukodir Khusanov', 'Uzbekistan', 'df'),
  ('Abdulla Abdullaev', 'Uzbekistan', 'df'),
  ('Bekhruz Karimov', 'Uzbekistan', 'df'),
  ('Jakhongir Urozov', 'Uzbekistan', 'df'),
  ('Avazbek Ulmasaliev', 'Uzbekistan', 'df'),
  ('Otabek Shukurov', 'Uzbekistan', 'md'),
  ('Jaloliddin Masharipov', 'Uzbekistan', 'md'),
  ('Odiljon Hamrobekov', 'Uzbekistan', 'md'),
  ('Oston Urunov', 'Uzbekistan', 'md'),
  ('Jamshid Iskanderov', 'Uzbekistan', 'md'),
  ('Dostonbek Khamdamov', 'Uzbekistan', 'md'),
  ('Abbosbek Fayzullaev', 'Uzbekistan', 'md'),
  ('Akmal Mozgovoy', 'Uzbekistan', 'md'),
  ('Azizjon Ganiev', 'Uzbekistan', 'md'),
  ('Sherzod Esanov', 'Uzbekistan', 'md'),
  ('Eldor Shomurodov', 'Uzbekistan', 'st'),
  ('Igor Sergeev', 'Uzbekistan', 'st'),
  ('Azizbek Amonov', 'Uzbekistan', 'st');

SELECT public.refresh_five_a_side_player_stats();
