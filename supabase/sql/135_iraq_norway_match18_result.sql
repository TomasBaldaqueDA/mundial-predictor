-- Match 18: Iraq 1-4 Norway (Group I, 16 Jun 2026)
-- Goals: Haaland 29' & 43' (assist Wolfe) | Hussein 39' (assist Al-Ammari) | Ostigard 76' (assist Odegaard) | Hussein 90+6' (OG)
-- MVP: Erling Haaland
-- Lineups: SofaScore (Jun 16 2026)
-- Hashem (SofaScore) = Akam Hashim in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 4,
  mvp    = 'Erling Haaland'
WHERE id = 18;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Norway' AND name = 'Erling Haaland';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Iraq' AND name = 'Aymen Hussein';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Leo Ostigard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'David Moller Wolfe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Iraq' AND name = 'Amir Al-Ammari';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Martin Odegaard';

SELECT public.add_match_appearances(18, 'Iraq', ARRAY[
  'Jalal Hassan', 'Merchas Doski', 'Akam Hashim', 'Zaid Tahseen', 'Hussein Ali',
  'Ali Jassim', 'Amir Al-Ammari', 'Zaid Ismail', 'Ibrahim Bayesh', 'Ali Al-Hamadi', 'Aymen Hussein',
  'Marko Farji', 'Zidane Iqbal', 'Ahmed Qasem', 'Mustafa Saadoon', 'Mohanad Ali'
]);

SELECT public.add_match_appearances(18, 'Norway', ARRAY[
  'Orjan Haskjold Nyland', 'Julian Ryerson', 'Kristoffer Vassbakk Ajer', 'Torbjorn Heggem', 'David Moller Wolfe',
  'Martin Odegaard', 'Sander Berge', 'Fredrik Aursnes', 'Antonio Nusa', 'Alexander Sorloth', 'Erling Haaland',
  'Leo Ostigard', 'Andreas Schjelderup', 'Oscar Bobb', 'Kristian Thorstvedt', 'Patrick Berg'
]);

SELECT public.refresh_five_a_side_player_stats();
