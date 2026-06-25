-- Match 54: South Africa 1-0 Korea Republic (Group A, 25 Jun 2026)
-- Goal: Maseko 63' (assist Moremi)
-- MVP: Thapelo Maseko
-- Lineups: SofaScore (Jun 25 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp    = 'Thapelo Maseko'
WHERE id = 54;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'South Africa' AND name = 'Thapelo Maseko';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'South Africa' AND name = 'Tshepang Moremi';

SELECT public.add_match_appearances(54, 'South Africa', ARRAY[
  'Ronwen Williams', 'Aubrey Modiba', 'Mbekezeli Mbokazi', 'Ime Okon', 'Khuliso Mudau',
  'Sphephelo Sithole', 'Thalente Mbatha', 'Oswin Appollis', 'Relebohile Mofokeng', 'Thapelo Maseko', 'Evidence Makgopa',
  'Tshepang Moremi', 'Iqraam Rayners', 'Jayden Adams'
]);

SELECT public.add_match_appearances(54, 'Korea Republic', ARRAY[
  'Kim Seung-gyu', 'Lee Han-beom', 'Kim Min-jae', 'Lee Ki-hyuk', 'Seol Young-woo',
  'Paik Seung-ho', 'Hwang In-beom', 'Lee Tae-seok', 'Lee Jae-sung', 'Hwang Hee-chan', 'Oh Hyeong-yu',
  'Jens Castrop', 'Kim Jin-gyu', 'Son Heung-min', 'Park Jin-seob', 'Cho Gue-sung'
]);

SELECT public.refresh_five_a_side_player_stats();
