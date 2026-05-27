-- Egypt 2026 World Cup squad (27: 4 GK, 9 DF, 11 MD, 3 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Egypt';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Mohamed El Shenawy', 'Egypt', 'gk'),
  ('Mostafa Shobeir', 'Egypt', 'gk'),
  ('El Mahdi Soliman', 'Egypt', 'gk'),
  ('Mohamed Alaa', 'Egypt', 'gk'),
  ('Mohamed Hany', 'Egypt', 'df'),
  ('Tarek Alaa', 'Egypt', 'df'),
  ('Hamdi Fathy', 'Egypt', 'df'),
  ('Ramy Rabia', 'Egypt', 'df'),
  ('Yasser Ibrahim', 'Egypt', 'df'),
  ('Hossam Abdelmaguid', 'Egypt', 'df'),
  ('Mohamed Abdelmonem', 'Egypt', 'df'),
  ('Ahmed Fatouh', 'Egypt', 'df'),
  ('Karim Hafez', 'Egypt', 'df'),
  ('Marwan Attia', 'Egypt', 'md'),
  ('Mohannad Lasheen', 'Egypt', 'md'),
  ('Nabil Emad Dunga', 'Egypt', 'md'),
  ('Mahmoud Saber', 'Egypt', 'md'),
  ('Ahmed Sayed Zizo', 'Egypt', 'md'),
  ('Mahmoud Trezeguet', 'Egypt', 'md'),
  ('Emam Ashour', 'Egypt', 'md'),
  ('Mostafa Ziko', 'Egypt', 'md'),
  ('Ibrahim Adel', 'Egypt', 'md'),
  ('Haitham Hassan', 'Egypt', 'md'),
  ('Mohamed Salah', 'Egypt', 'md'),
  ('Omar Marmoush', 'Egypt', 'st'),
  ('Aktay Abdallah', 'Egypt', 'st'),
  ('Hamza Abdel Karim', 'Egypt', 'st');

SELECT public.refresh_five_a_side_player_stats();
