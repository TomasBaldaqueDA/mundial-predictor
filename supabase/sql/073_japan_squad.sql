-- Japan 2026 World Cup squad (26: 3 GK, 9 DF, 8 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Japan';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Tomoki Hayakawa', 'Japan', 'gk'),
  ('Keisuke Osako', 'Japan', 'gk'),
  ('Zion Suzuki', 'Japan', 'gk'),
  ('Yuto Nagatomo', 'Japan', 'df'),
  ('Shogo Taniguchi', 'Japan', 'df'),
  ('Ko Itakura', 'Japan', 'df'),
  ('Tsuyoshi Watanabe', 'Japan', 'df'),
  ('Takehiro Tomiyasu', 'Japan', 'df'),
  ('Hiroki Ito', 'Japan', 'df'),
  ('Ayumu Seko', 'Japan', 'df'),
  ('Yukinari Sugawara', 'Japan', 'df'),
  ('Junosuke Suzuki', 'Japan', 'df'),
  ('Wataru Endo', 'Japan', 'md'),
  ('Junya Ito', 'Japan', 'md'),
  ('Daichi Kamada', 'Japan', 'md'),
  ('Keito Nakamura', 'Japan', 'md'),
  ('Kaishu Sano', 'Japan', 'md'),
  ('Takefusa Kubo', 'Japan', 'md'),
  ('Ritsu Doan', 'Japan', 'md'),
  ('Ao Tanaka', 'Japan', 'md'),
  ('Koki Ogawa', 'Japan', 'st'),
  ('Daizen Maeda', 'Japan', 'st'),
  ('Ayase Ueda', 'Japan', 'st'),
  ('Yuito Suzuki', 'Japan', 'st'),
  ('Kento Shiogai', 'Japan', 'st'),
  ('Keisuke Goto', 'Japan', 'st');

SELECT public.refresh_five_a_side_player_stats();
