-- Match 37: Spain 4-0 Saudi Arabia (Group H, 21 Jun 2026)
-- Goals: Yamal 10' (assist Oyarzabal) | Oyarzabal 21' (assist Laporte), 24' (assist Olmo)
--        Tambakti 49' (OG, uncredited)
-- MVP: Mikel Oyarzabal
-- Lineups: SofaScore (Jun 21 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 0,
  mvp    = 'Mikel Oyarzabal'
WHERE id = 37;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Lamine Yamal';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Oyarzabal';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Spain' AND name = 'Mikel Oyarzabal';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Mikel Oyarzabal';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Aymeric Laporte';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Spain' AND name = 'Dani Olmo';

SELECT public.add_match_appearances(37, 'Spain', ARRAY[
  'Unai Simón', 'Marc Cucurella', 'Aymeric Laporte', 'Pau Cubarsí', 'Pedro Porro',
  'Pedri', 'Rodri', 'Dani Olmo', 'Álex Baena', 'Mikel Oyarzabal', 'Lamine Yamal',
  'Ferran Torres', 'Yéremy Pino', 'Nico Williams', 'Mikel Merino', 'Fabián Ruiz'
]);

SELECT public.add_match_appearances(37, 'Saudi Arabia', ARRAY[
  'Mohammed Al Owais', 'Saud Abdulhamid', 'Abdulelah Al Amri', 'Ali Lajami', 'Hassan Tambakti', 'Moteb Al Harbi',
  'Musab Al Juwayr', 'Abdullah Al Khaibari', 'Nasser Al Dawsari', 'Salem Al Dawsari', 'Firas Al Buraikan',
  'Mohammed Kanno', 'Abdullah Al Hamdan', 'Mohammed Abu Al Shamat', 'Alaa Al Hajji', 'Khalid Al Ghannam'
]);

SELECT public.refresh_five_a_side_player_stats();
