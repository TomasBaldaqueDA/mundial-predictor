-- Match 94 (FIFA M94): USA 1-4 Belgium (Round of 16, 7 Jul 2026 — W81 vs W82)
-- Goals: De Ketelaere 9', 33' (assists Raskin, Trossard); Tillman 31'; Vanaken 57' (assist De Ketelaere); Lukaku 90+3' (assist Vanaken)
-- MVP: Charles De Ketelaere
-- Belgium advances to Quarter-final (match 98 team2 = W94)
-- Lineups: SofaScore (Jul 7 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 4,
  mvp       = 'Charles De Ketelaere',
  qualifier = 'Belgium'
WHERE id = 94;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Belgium' AND name = 'Charles De Ketelaere';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Malik Tillman';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Hans Vanaken';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Belgium' AND name = 'Romelu Lukaku';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Nicolas Raskin';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Leandro Trossard';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Charles De Ketelaere';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Belgium' AND name = 'Hans Vanaken';

UPDATE public.matches SET team2 = 'Belgium'
WHERE id = 98 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(94, 'USA', ARRAY[
  'Matt Freese', 'Antonee Robinson', 'Tim Ream', 'Chris Richards', 'Alex Freeman',
  'Malik Tillman', 'Tyler Adams', 'Weston McKennie', 'Christian Pulisic', 'Folarin Balogun', 'Sergiño Dest',
  'Gio Reyna', 'Sebastian Berhalter', 'Ricardo Pepi', 'Max Arfsten', 'Haji Wright'
]);

SELECT public.add_match_appearances(94, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Timothy Castagne', 'Nathan Ngoy', 'Brandon Mechele', 'Maxim De Cuyper',
  'Amadou Onana', 'Nicolas Raskin', 'Dodi Lukebakio', 'Youri Tielemans', 'Leandro Trossard', 'Charles De Ketelaere',
  'Hans Vanaken', 'Jeremy Doku', 'Romelu Lukaku', 'Alexis Saelemaekers', 'Axel Witsel'
]);

SELECT public.refresh_five_a_side_player_stats();
