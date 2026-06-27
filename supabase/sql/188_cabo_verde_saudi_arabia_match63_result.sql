-- Match 63: Cabo Verde 0-0 Saudi Arabia (Group H, 27 Jun 2026)
-- MVP: Deroy Duarte
-- Lineups: SofaScore (Jun 27 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Deroy Duarte'
WHERE id = 63;

SELECT public.add_match_appearances(63, 'Cabo Verde', ARRAY[
  'Vozinha', 'Joao Paulo Fernandes', 'Diney Borges', 'Roberto Lopes', 'Wagner Pina',
  'Kevin Pina', 'Willy Semedo', 'Jamiro Monteiro', 'Deroy Duarte', 'Ryan Mendes', 'Dailon Livramento',
  'Helio Varela', 'Nuno Da Costa', 'Garry Rodrigues', 'Laros Duarte', 'Steven Moreira'
]);

SELECT public.add_match_appearances(63, 'Saudi Arabia', ARRAY[
  'Mohammed Al Owais', 'Saud Abdulhamid', 'Abdulelah Al Amri', 'Hassan Tambakti', 'Nawaf Boushal',
  'Sultan Mandash', 'Abdullah Al Khaibari', 'Nasser Al Dawsari', 'Salem Al Dawsari', 'Firas Al Buraikan', 'Mohammed Kanno',
  'Ali Lajami', 'Musab Al Juwayr', 'Abdullah Al Hamdan', 'Mohammed Abu Al Shamat', 'Moteb Al Harbi'
]);

SELECT public.refresh_five_a_side_player_stats();
