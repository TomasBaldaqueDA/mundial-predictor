-- Korea Republic 2026 World Cup squad (26: 3 GK, 10 DF, 10 MD, 3 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Korea Republic';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Song Bum-keun', 'Korea Republic', 'gk'),
  ('Jo Hyeon-woo', 'Korea Republic', 'gk'),
  ('Kim Seung-gyu', 'Korea Republic', 'gk'),
  ('Jens Castrop', 'Korea Republic', 'df'),
  ('Lee Han-beom', 'Korea Republic', 'df'),
  ('Park Jin-seob', 'Korea Republic', 'df'),
  ('Lee Ki-hyuk', 'Korea Republic', 'df'),
  ('Kim Min-jae', 'Korea Republic', 'df'),
  ('Kim Moon-hwan', 'Korea Republic', 'df'),
  ('Kim Tae-hyeon', 'Korea Republic', 'df'),
  ('Lee Tae-seok', 'Korea Republic', 'df'),
  ('Seol Young-woo', 'Korea Republic', 'df'),
  ('Cho Yu-min', 'Korea Republic', 'df'),
  ('Lee Dongg-yeong', 'Korea Republic', 'md'),
  ('Hwang Hee-chan', 'Korea Republic', 'md'),
  ('Yang Hyun-jun', 'Korea Republic', 'md'),
  ('Hwang In-beom', 'Korea Republic', 'md'),
  ('Lee Jae-sung', 'Korea Republic', 'md'),
  ('Kim Jin-gyu', 'Korea Republic', 'md'),
  ('Eom Ji-sung', 'Korea Republic', 'md'),
  ('Bae Jun-ho', 'Korea Republic', 'md'),
  ('Lee Kan-gin', 'Korea Republic', 'md'),
  ('Paik Seung-ho', 'Korea Republic', 'md'),
  ('Cho Gue-sung', 'Korea Republic', 'st'),
  ('Son Heung-min', 'Korea Republic', 'st'),
  ('Oh Hyeong-yu', 'Korea Republic', 'st');

SELECT public.refresh_five_a_side_player_stats();
