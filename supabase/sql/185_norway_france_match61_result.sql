-- Match 61: Norway 1-4 France (Group I, 26 Jun 2026)
-- Goals: Dembele 7' (assist Mbappe) | Dembele 20' (assist Mbappe) | Aasgaard 21' (assist Schjelderup)
--        Dembele 32' (assist Tchouameni) | Doue 90+4 (assist Barcola)
-- MVP: Ousmane Dembele
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 4,
  mvp    = 'Ousmane Dembele'
WHERE id = 61;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Norway' AND name = 'Thelonious Aasgaard';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Desire Doue';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Norway' AND name = 'Andreas Schjelderup';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Aurelien Tchouameni';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Bradley Barcola';

SELECT public.add_match_appearances(61, 'Norway', ARRAY[
  'Egil Selvik', 'Fredrik Bjorkan', 'Leo Ostigard', 'Henrik Falchener', 'Fredrik Aursnes',
  'Patrick Berg', 'Jorgen Strand Larsen', 'Kristian Thorstvedt', 'Thelonious Aasgaard', 'Andreas Schjelderup', 'Oscar Bobb',
  'Marcus Holmgren Pedersen', 'Morten Thorsby', 'Sondre Langas', 'Jens Petter Hauge', 'Antonio Nusa'
]);

SELECT public.add_match_appearances(61, 'France', ARRAY[
  'Mike Maignan', 'Jules Kounde', 'Dayot Upamecano', 'Maxence Lacroix', 'Theo Hernandez',
  'Aurelien Tchouameni', 'Manu Kone', 'Ousmane Dembele', 'Michael Olise', 'Desire Doue', 'Kylian Mbappe',
  'Ibrahima Konate', 'Rayan Cherki', 'Bradley Barcola', 'Jean-Philippe Mateta', 'Malo Gusto'
]);

SELECT public.refresh_five_a_side_player_stats();
