-- Match 80: England 2-1 Congo DR (Round of 32, 1 Jul 2026 — 1L vs 3K)
-- Goals: Cipenga 7' (assist Mbemba) | Kane 75', 86' (assist Gordon)
-- MVP: Harry Kane
-- England advances to Round of 16 (match 92 team2 = W80)
-- Lineups: SofaScore (Jul 1 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp       = 'Harry Kane',
  qualifier = 'England'
WHERE id = 80;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Congo DR' AND name = 'Brian Cipenga';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Harry Kane';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Congo DR' AND name = 'Chancel Mbemba';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Anthony Gordon';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Anthony Gordon';

UPDATE public.matches SET team2 = 'England'
WHERE id = 92 AND stage = 'Round of 16';

SELECT public.add_match_appearances(80, 'England', ARRAY[
  'Jordan Pickford', 'Djed Spence', 'Marc Guehi', 'Ezri Konsa', 'Nico O''Reilly',
  'Declan Rice', 'Elliott Anderson', 'Jude Bellingham', 'Noni Madueke', 'Marcus Rashford', 'Harry Kane',
  'Anthony Gordon', 'Bukayo Saka', 'Eberechi Eze', 'John Stones'
]);

SELECT public.add_match_appearances(80, 'Congo DR', ARRAY[
  'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Chancel Mbemba', 'Alex Tuanzebe', 'Joris Kayembe',
  'Brian Cipenga', 'Noah Sadiki', 'Edo Kayembe', 'Meschack Elia', 'Yoane Wissa', 'Fiston Mayele',
  'Nathanael Mbuku', 'Theo Bongonda', 'Ngal''ayel Mukau', 'Arthur Masuaku', 'Samuel Moutoussamy'
]);

SELECT public.refresh_five_a_side_player_stats();
