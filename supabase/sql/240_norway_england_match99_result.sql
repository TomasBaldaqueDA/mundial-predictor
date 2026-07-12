-- Match 99 (FIFA M99): Norway 1-1 England, AET 1-2 (Quarter-final, 11 Jul 2026 — W91 vs W92)
-- 90': Schjelderup 36' (assist Odegaard) | Bellingham 45+2' (assist Gordon)
-- AET: Bellingham 93'
-- MVP: Jude Bellingham
-- Games score = 90' (1-1); qualifier = England. Five-a-side goals/assists include ET; no wins (draw at 90').
-- England advances to Semi-final (match 102 team1 = W99)
-- Lineups: SofaScore (Jul 11 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Jude Bellingham',
  qualifier = 'England'
WHERE id = 99;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Andreas Schjelderup';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Martin Odegaard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Anthony Gordon';

UPDATE public.matches SET team1 = 'England'
WHERE id = 102 AND stage = 'Semi-final';

SELECT public.add_match_appearances(99, 'Norway', ARRAY[
  'Orjan Haskjold Nyland', 'Julian Ryerson', 'Kristoffer Vassbakk Ajer', 'Torbjorn Heggem', 'David Moller Wolfe',
  'Martin Odegaard', 'Sander Berge', 'Patrick Berg', 'Andreas Schjelderup', 'Erling Haaland', 'Alexander Sorloth',
  'Fredrik Aursnes', 'Oscar Bobb', 'Antonio Nusa', 'Marcus Holmgren Pedersen', 'Leo Ostigard', 'Jorgen Strand Larsen'
]);

SELECT public.add_match_appearances(99, 'England', ARRAY[
  'Jordan Pickford', 'Jarell Quansah', 'Ezri Konsa', 'Marc Guehi', 'Nico O''Reilly',
  'Declan Rice', 'Elliott Anderson', 'Noni Madueke', 'Jude Bellingham', 'Anthony Gordon', 'Harry Kane',
  'Eberechi Eze', 'Bukayo Saka', 'Reece James', 'Djed Spence', 'Morgan Rogers', 'Dan Burn'
]);

SELECT public.refresh_five_a_side_player_stats();
