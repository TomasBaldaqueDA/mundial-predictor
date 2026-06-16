-- Match 15: Saudi Arabia 1-1 Uruguay (Group H, 15 Jun 2026)
-- Goals: Al-Amri 41' | Araújo 80' (assist Ugarte)
-- MVP: Federico Valverde
-- Lineups: SofaScore (Jun 15 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Federico Valverde'
WHERE id = 15;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Saudi Arabia' AND name = 'Abdulelah Al Amri';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Uruguay' AND name = 'Maxi Araujo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Uruguay' AND name = 'Manuel Ugarte';

SELECT public.add_match_appearances(15, 'Saudi Arabia', ARRAY[
  'Mohammed Al Owais', 'Moteb Al Harbi', 'Hassan Tambakti', 'Abdulelah Al Amri', 'Saud Abdulhamid',
  'Salem Al Dawsari', 'Abdullah Al Khaibari', 'Mohammed Kanno', 'Mohammed Abu Al Shamat', 'Musab Al Juwayr', 'Firas Al Buraikan',
  'Nasser Al Dawsari', 'Nawaf Boushal', 'Ali Lajami', 'Alaa Al Hajji', 'Abdullah Al Hamdan'
]);

SELECT public.add_match_appearances(15, 'Uruguay', ARRAY[
  'Fernando Muslera', 'Guillermo Varela', 'Sebastian Caceres', 'Mathias Olivera', 'Matias Vina',
  'Federico Valverde', 'Manuel Ugarte', 'Rodrigo Bentancur', 'Darwin Nunez', 'Federico Vinas', 'Maxi Araujo',
  'Juan Manuel Sanabria', 'Agustin Canobbio', 'Nicolas de la Cruz', 'Brian Rodriguez', 'Rodrigo Aguirre'
]);

SELECT public.refresh_five_a_side_player_stats();
