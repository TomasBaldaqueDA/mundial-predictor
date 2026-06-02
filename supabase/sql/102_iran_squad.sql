-- IR Iran 2026 World Cup squad (26: 3 GK, 8 DF, 10 MD, 5 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'IR Iran';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Alireza Beiranvand', 'IR Iran', 'gk'),
  ('Seyed Hossein Hosseini', 'IR Iran', 'gk'),
  ('Payam Niazmand', 'IR Iran', 'gk'),
  ('Danial Eiri', 'IR Iran', 'df'),
  ('Ehsan Hajsafi', 'IR Iran', 'df'),
  ('Saleh Hardani', 'IR Iran', 'df'),
  ('Hossein Kanaani', 'IR Iran', 'df'),
  ('Shoja Khalilzadeh', 'IR Iran', 'df'),
  ('Milad Mohammadi', 'IR Iran', 'df'),
  ('Ali Nemati', 'IR Iran', 'df'),
  ('Ramin Rezaeian', 'IR Iran', 'df'),
  ('Rouzbeh Cheshmi', 'IR Iran', 'md'),
  ('Saeid Ezatolahi', 'IR Iran', 'md'),
  ('Mehdi Ghaedi', 'IR Iran', 'md'),
  ('Saman Ghoddos', 'IR Iran', 'md'),
  ('Mohammad Ghorbani', 'IR Iran', 'md'),
  ('Alireza Jahanbakhsh', 'IR Iran', 'md'),
  ('Mohammad Mohebi', 'IR Iran', 'md'),
  ('Amir Mohammad Razzaghinia', 'IR Iran', 'md'),
  ('Mehdi Torabi', 'IR Iran', 'md'),
  ('Aria Yousefi', 'IR Iran', 'md'),
  ('Ali Alipour', 'IR Iran', 'st'),
  ('Dennis Dargahi', 'IR Iran', 'st'),
  ('Amirhossein Hosseinzadeh', 'IR Iran', 'st'),
  ('Mehdi Taremi', 'IR Iran', 'st'),
  ('Shahriar Moghanlou', 'IR Iran', 'st');

SELECT public.refresh_five_a_side_player_stats();
