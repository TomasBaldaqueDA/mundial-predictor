-- Türkiye 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Türkiye';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Ugurcan Cakir', 'Türkiye', 'gk'),
  ('Altay Bayindir', 'Türkiye', 'gk'),
  ('Mert Gunok', 'Türkiye', 'gk'),
  ('Ferdi Kadioglu', 'Türkiye', 'df'),
  ('Merih Demiral', 'Türkiye', 'df'),
  ('Zeki Celik', 'Türkiye', 'df'),
  ('Ozan Kabak', 'Türkiye', 'df'),
  ('Mert Muldur', 'Türkiye', 'df'),
  ('Abdulkerim Bardakci', 'Türkiye', 'df'),
  ('Eren Elmali', 'Türkiye', 'df'),
  ('Caglar Soyuncu', 'Türkiye', 'df'),
  ('Samet Akaydin', 'Türkiye', 'df'),
  ('Arda Guler', 'Türkiye', 'md'),
  ('Can Uzun', 'Türkiye', 'md'),
  ('Orkun Kokcu', 'Türkiye', 'md'),
  ('Hakan Calhanoglu', 'Türkiye', 'md'),
  ('Ismail Yuksek', 'Türkiye', 'md'),
  ('Kaan Ayhan', 'Türkiye', 'md'),
  ('Salih Ozcan', 'Türkiye', 'md'),
  ('Kenan Yildiz', 'Türkiye', 'st'),
  ('Baris Alper Yilmaz', 'Türkiye', 'st'),
  ('Kerem Akturkoglu', 'Türkiye', 'st'),
  ('Yunus Akgun', 'Türkiye', 'st'),
  ('Oguz Aydin', 'Türkiye', 'st'),
  ('Deniz Gul', 'Türkiye', 'st'),
  ('Irfan Can Kahveci', 'Türkiye', 'st');

SELECT public.refresh_five_a_side_player_stats();
