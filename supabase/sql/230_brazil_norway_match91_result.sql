-- Match 91 (FIFA M91): Brazil 1-2 Norway (Round of 16, 5 Jul 2026 — W76 vs W78)
-- Goals: Haaland 79', 90' (assists Schjelderup); Neymar Jr 90+10' (pen)
-- MVP: Erling Haaland
-- Norway advances to Quarter-final (match 99 team1 = W91)
-- Lineups: SofaScore (Jul 5 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 2,
  mvp       = 'Erling Haaland',
  qualifier = 'Norway'
WHERE id = 91;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Norway' AND name = 'Erling Haaland';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Neymar Jr';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Norway' AND name = 'Andreas Schjelderup';

UPDATE public.matches SET team1 = 'Norway'
WHERE id = 99 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(91, 'Brazil', ARRAY[
  'Alisson', 'Douglas Santos', 'Gabriel Magalhaes', 'Marquinhos', 'Danilo',
  'Gabriel Martinelli', 'Casemiro', 'Bruno Guimaraes', 'Rayan', 'Vinicius Jr', 'Matheus Cunha',
  'Endrick', 'Danilo Santos', 'Neymar Jr', 'Ederson'
]);

SELECT public.add_match_appearances(91, 'Norway', ARRAY[
  'Orjan Haskjold Nyland', 'Julian Ryerson', 'Kristoffer Vassbakk Ajer', 'Torbjorn Heggem', 'David Moller Wolfe',
  'Martin Odegaard', 'Sander Berge', 'Patrick Berg', 'Alexander Sorloth', 'Erling Haaland', 'Antonio Nusa',
  'Andreas Schjelderup', 'Oscar Bobb', 'Fredrik Aursnes', 'Leo Ostigard'
]);

SELECT public.refresh_five_a_side_player_stats();
