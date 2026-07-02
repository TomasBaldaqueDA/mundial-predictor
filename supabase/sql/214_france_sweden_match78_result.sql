-- Match 78: France 3-0 Sweden (Round of 32, 30 Jun 2026 — 1I vs 3F)
-- Goals: Mbappe 45', 74' (assist Dembele, Olise) | Barcola 53' (assist Olise)
-- MVP: Kylian Mbappe
-- France advances to Round of 16 (match 89 team2 = W77, FIFA M77)
-- Lineups: SofaScore (Jun 30 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 0,
  mvp       = 'Kylian Mbappe',
  qualifier = 'France'
WHERE id = 78;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Bradley Barcola';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Michael Olise';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Michael Olise';

UPDATE public.matches SET team2 = 'France'
WHERE id = 89 AND stage = 'Round of 16';

SELECT public.add_match_appearances(78, 'France', ARRAY[
  'Mike Maignan', 'Lucas Digne', 'William Saliba', 'Dayot Upamecano', 'Jules Kounde',
  'Adrien Rabiot', 'Aurelien Tchouameni', 'Bradley Barcola', 'Michael Olise', 'Ousmane Dembele', 'Kylian Mbappe',
  'Desire Doue', 'Malo Gusto', 'Theo Hernandez', 'Jean-Philippe Mateta', 'Rayan Cherki'
]);

SELECT public.add_match_appearances(78, 'Sweden', ARRAY[
  'Jacob Widell Zetterstrom', 'Daniel Svensson', 'Gustaf Lagerbielke', 'Victor Lindelof', 'Gabriel Gudmundsson',
  'Anthony Elanga', 'Lucas Bergvall', 'Yasin Ayari', 'Elliot Stroud', 'Viktor Gyokeres', 'Alexander Isak',
  'Taha Ali', 'Besfort Zeneli', 'Mattias Svanberg', 'Benjamin Nygren', 'Gustaf Nilsson'
]);

SELECT public.refresh_five_a_side_player_stats();
