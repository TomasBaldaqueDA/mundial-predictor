-- Match 81: Belgium 2-2 Senegal, AET 3-2 (Round of 32, 1 Jul 2026 — 1G vs 3I)
-- 90': Diarra 24' | Sarr 51' (assist Niakhate) | Lukaku 86' (assist Meunier) | Tielemans 89' (assist Trossard)
-- AET: Tielemans 120'+5 pen
-- MVP: Youri Tielemans
-- Games score = 90' (2-2); qualifier = Belgium. Five-a-side goals/assists include ET; no wins (draw at 90').
-- Belgium advances to Round of 16 (match 93 team1 = W81)
-- Lineups: SofaScore (Jul 1 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 2,
  mvp       = 'Youri Tielemans',
  qualifier = 'Belgium'
WHERE id = 81;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Youri Tielemans';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Youri Tielemans';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Romelu Lukaku';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Habib Diarra';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Ismaila Sarr';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Thomas Meunier';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Leandro Trossard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Moussa Niakhate';

UPDATE public.matches SET team1 = 'Belgium'
WHERE id = 93 AND stage = 'Round of 16';

SELECT public.add_match_appearances(81, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Timothy Castagne', 'Brandon Mechele', 'Arthur Theate', 'Maxim De Cuyper',
  'Youri Tielemans', 'Hans Vanaken', 'Leandro Trossard', 'Kevin De Bruyne', 'Jeremy Doku', 'Charles De Ketelaere',
  'Romelu Lukaku', 'Nicolas Raskin', 'Dodi Lukebakio', 'Diego Moreira', 'Thomas Meunier', 'Amadou Onana'
]);

SELECT public.add_match_appearances(81, 'Senegal', ARRAY[
  'Mory Diaw', 'Krepin Diatta', 'Pathe Ciss', 'Moussa Niakhate', 'Ismail Jakobs',
  'Iliman Ndiaye', 'Habib Diarra', 'Idrissa Gana Gueye', 'Pape Gueye', 'Ismaila Sarr', 'Sadio Mane',
  'Lamine Camara', 'Pape Matar Sarr', 'Ibrahim Mbaye', 'El Hadji Malick Diouf', 'Nicolas Jackson', 'Bara Sapoko Ndiaye'
]);

SELECT public.refresh_five_a_side_player_stats();
