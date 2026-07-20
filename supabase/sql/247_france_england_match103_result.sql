-- Match 103 (FIFA M103): France 4-6 England (3rd-place play-off, 18 Jul 2026 — RU101 vs RU102)
-- Goals: Rice 3'; Konsa 18' (assist Rice); Saka 37' (Rashford), 45'+1 (Eze), 87' pen; Bellingham 90'+8;
--        Mbappé 48', 66' (assists Olise); Barcola 54' (assist Mbappé); Dembélé 90'+6 (assist Upamecano)
-- MVP: Bukayo Saka
-- England wins 3rd place
-- Lineups: Flashscore / SofaScore (Jul 18 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 6,
  mvp       = 'Bukayo Saka',
  qualifier = 'England'
WHERE id = 103;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Declan Rice';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Ezri Konsa';

UPDATE public.five_a_side_players SET goals = goals + 3
WHERE team = 'England' AND name = 'Bukayo Saka';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'England' AND name = 'Jude Bellingham';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Bradley Barcola';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Declan Rice';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Marcus Rashford';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'England' AND name = 'Eberechi Eze';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'France' AND name = 'Michael Olise';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Dayot Upamecano';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

SELECT public.add_match_appearances(103, 'France', ARRAY[
  'Mike Maignan', 'Malo Gusto', 'Ibrahima Konate', 'Maxence Lacroix', 'Theo Hernandez',
  'Warren Zaire-Emery', 'Adrien Rabiot', 'Michael Olise', 'Rayan Cherki', 'Desire Doue', 'Kylian Mbappe',
  'Dayot Upamecano', 'Lucas Digne', 'Ousmane Dembele', 'Bradley Barcola', 'Jules Kounde'
]);

SELECT public.add_match_appearances(103, 'England', ARRAY[
  'Dean Henderson', 'Djed Spence', 'Marc Guehi', 'Ezri Konsa', 'Jarell Quansah',
  'Declan Rice', 'Marcus Rashford', 'Eberechi Eze', 'Morgan Rogers', 'Bukayo Saka', 'Ivan Toney',
  'Ollie Watkins', 'Elliott Anderson', 'Jude Bellingham', 'Reece James'
]);

SELECT public.refresh_five_a_side_player_stats();
