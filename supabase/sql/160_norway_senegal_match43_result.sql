-- Match 43: Norway 3-2 Senegal (Group I, 23 Jun 2026)
-- Goals: Pedersen 43' | Haaland 48' (assist Odegaard), 58' (assist Berg) | Sarr 53', 90+3'
-- MVP: Erling Haaland
-- Lineups: SofaScore (Jun 23 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 2,
  mvp    = 'Erling Haaland'
WHERE id = 43;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Marcus Holmgren Pedersen';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Norway' AND name = 'Erling Haaland';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Senegal' AND name = 'Ismaila Sarr';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Martin Odegaard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Patrick Berg';

SELECT public.add_match_appearances(43, 'Norway', ARRAY[
  'Orjan Haskjold Nyland', 'Julian Ryerson', 'Kristoffer Vassbakk Ajer', 'Leo Ostigard', 'David Moller Wolfe',
  'Fredrik Aursnes', 'Sander Berge', 'Martin Odegaard', 'Antonio Nusa', 'Erling Haaland', 'Oscar Bobb',
  'Marcus Holmgren Pedersen', 'Patrick Berg', 'Andreas Schjelderup', 'Torbjorn Heggem', 'Alexander Sorloth'
]);

SELECT public.add_match_appearances(43, 'Senegal', ARRAY[
  'Edouard Mendy', 'Krepin Diatta', 'Kalidou Koulibaly', 'Moussa Niakhate', 'El Hadji Malick Diouf',
  'Idrissa Gana Gueye', 'Pape Gueye', 'Ismaila Sarr', 'Lamine Camara', 'Sadio Mane', 'Nicolas Jackson',
  'Ismail Jakobs', 'Ibrahim Mbaye', 'Mory Diaw', 'Pathe Ciss', 'Pape Matar Sarr'
]);

SELECT public.refresh_five_a_side_player_stats();
