-- Match 77: Côte d'Ivoire 1-2 Norway (Round of 32, 30 Jun 2026 — 2E vs 2I)
-- Goals: Nusa 39' (assist Odegaard) | Diallo 74' (assist Pepe) | Haaland 86' (assist Berg)
-- MVP: Antonio Nusa
-- Norway advances to Round of 16 (match 91 team2 = W78, FIFA M78)
-- Lineups: SofaScore (Jun 30 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 2,
  mvp       = 'Antonio Nusa',
  qualifier = 'Norway'
WHERE id = 77;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Antonio Nusa';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Erling Haaland';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Amad Diallo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Martin Odegaard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Côte d''Ivoire' AND name = 'Nicolas Pepe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Patrick Berg';

UPDATE public.matches SET team2 = 'Norway'
WHERE id = 91 AND stage = 'Round of 16';

SELECT public.add_match_appearances(77, 'Côte d''Ivoire', ARRAY[
  'Yahia Fofana', 'Christopher Operi', 'Ousmane Diomande', 'Emmanuel Agbadou', 'Odilon Kossounou', 'Guela Doué',
  'Franck Kessie', 'Ibrahim Sangare', 'Yan Diomande', 'Nicolas Pepe', 'Ange-Yoan Bonny',
  'Amad Diallo', 'Elye Wahi', 'Oumar Diakite', 'Bazoumana Toure', 'Evann Guessand'
]);

SELECT public.add_match_appearances(77, 'Norway', ARRAY[
  'Orjan Haskjold Nyland', 'Julian Ryerson', 'Kristoffer Vassbakk Ajer', 'Leo Ostigard', 'David Moller Wolfe',
  'Patrick Berg', 'Sander Berge', 'Martin Odegaard', 'Antonio Nusa', 'Erling Haaland', 'Alexander Sorloth',
  'Andreas Schjelderup', 'Oscar Bobb', 'Fredrik Aursnes'
]);

SELECT public.refresh_five_a_side_player_stats();
