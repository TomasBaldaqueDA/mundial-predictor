-- Jordan 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Jordan';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Yazeed Abulaila', 'Jordan', 'gk'),
  ('Abdallah Al-Fakhouri', 'Jordan', 'gk'),
  ('Nour Bani Attiah', 'Jordan', 'gk'),
  ('Ihsan Haddad', 'Jordan', 'df'),
  ('Yazan Al-Arab', 'Jordan', 'df'),
  ('Abdallah Nasib', 'Jordan', 'df'),
  ('Mohammad Abu Hashish', 'Jordan', 'df'),
  ('Saed Al-Rosan', 'Jordan', 'df'),
  ('Husam Abu Dahab', 'Jordan', 'df'),
  ('Mo Abualnadi', 'Jordan', 'df'),
  ('Salim Obaid', 'Jordan', 'df'),
  ('Anas Badawi', 'Jordan', 'df'),
  ('Rajaei Ayed', 'Jordan', 'md'),
  ('Noor Al-Rawabdeh', 'Jordan', 'md'),
  ('Ibrahim Sadeh', 'Jordan', 'md'),
  ('Nizar Al-Rashdan', 'Jordan', 'md'),
  ('Mohannad Abu Taha', 'Jordan', 'md'),
  ('Amer Jamous', 'Jordan', 'md'),
  ('Mohammad Al-Dawoud', 'Jordan', 'md'),
  ('Musa Al-Taamari', 'Jordan', 'st'),
  ('Mahmoud Al-Mardi', 'Jordan', 'st'),
  ('Ali Olwan', 'Jordan', 'st'),
  ('Mohammad Abu Zrayq', 'Jordan', 'st'),
  ('Odeh Al-Fakhouri', 'Jordan', 'st'),
  ('Ibrahim Sabra', 'Jordan', 'st'),
  ('Ali Azaizeh', 'Jordan', 'st');

SELECT public.refresh_five_a_side_player_stats();
