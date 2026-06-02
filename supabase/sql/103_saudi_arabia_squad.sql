-- Saudi Arabia 2026 World Cup squad (26: 3 GK, 11 DF, 9 MD, 3 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Saudi Arabia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Mohammed Al Owais', 'Saudi Arabia', 'gk'),
  ('Nawaf Al Aqidi', 'Saudi Arabia', 'gk'),
  ('Ahmed Al Kassar', 'Saudi Arabia', 'gk'),
  ('Abdulelah Al Amri', 'Saudi Arabia', 'df'),
  ('Hassan Tambakti', 'Saudi Arabia', 'df'),
  ('Jehad Thikri', 'Saudi Arabia', 'df'),
  ('Ali Lajami', 'Saudi Arabia', 'df'),
  ('Hassan Kadesh', 'Saudi Arabia', 'df'),
  ('Saud Abdulhamid', 'Saudi Arabia', 'df'),
  ('Mohammed Abu Al Shamat', 'Saudi Arabia', 'df'),
  ('Ali Majrashi', 'Saudi Arabia', 'df'),
  ('Moteb Al Harbi', 'Saudi Arabia', 'df'),
  ('Nawaf Boushal', 'Saudi Arabia', 'df'),
  ('Sultan Al-Ghannam', 'Saudi Arabia', 'df'),
  ('Mohammed Kanno', 'Saudi Arabia', 'md'),
  ('Abdullah Al Khaibari', 'Saudi Arabia', 'md'),
  ('Ziyad Al Johani', 'Saudi Arabia', 'md'),
  ('Nasser Al Dawsari', 'Saudi Arabia', 'md'),
  ('Musab Al Juwayr', 'Saudi Arabia', 'md'),
  ('Alaa Al Hajji', 'Saudi Arabia', 'md'),
  ('Salem Al Dawsari', 'Saudi Arabia', 'md'),
  ('Khalid Al Ghannam', 'Saudi Arabia', 'md'),
  ('Ayman Yahya', 'Saudi Arabia', 'md'),
  ('Firas Al Buraikan', 'Saudi Arabia', 'st'),
  ('Saleh Al Shehri', 'Saudi Arabia', 'st'),
  ('Abdullah Al Hamdan', 'Saudi Arabia', 'st');

SELECT public.refresh_five_a_side_player_stats();
