-- Match 17: France 3-1 Senegal (Group I, 16 Jun 2026)
-- Goals: Mbappé 66' & 90+6' (assist Olise) | Barcola 82' (assist Rabiot) | Mbaye 90+5' (assist Ndiaye)
-- MVP: Michael Olise
-- Lineups: SofaScore (Jun 16 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 1,
  mvp    = 'Michael Olise'
WHERE id = 17;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Bradley Barcola';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Senegal' AND name = 'Ibrahim Mbaye';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Michael Olise';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Adrien Rabiot';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Senegal' AND name = 'Iliman Ndiaye';

SELECT public.add_match_appearances(17, 'France', ARRAY[
  'Mike Maignan', 'Jules Kounde', 'Dayot Upamecano', 'William Saliba', 'Theo Hernandez',
  'Aurelien Tchouameni', 'Adrien Rabiot', 'Michael Olise', 'Ousmane Dembele', 'Desire Doue', 'Kylian Mbappe',
  'Bradley Barcola', 'Rayan Cherki'
]);

SELECT public.add_match_appearances(17, 'Senegal', ARRAY[
  'Edouard Mendy', 'El Hadji Malick Diouf', 'Moussa Niakhate', 'Kalidou Koulibaly', 'Krepin Diatta',
  'Pape Gueye', 'Idrissa Gana Gueye', 'Sadio Mane', 'Lamine Camara', 'Ismaila Sarr', 'Nicolas Jackson',
  'Ibrahim Mbaye', 'Habib Diarra', 'Iliman Ndiaye', 'Bamba Dieng', 'Pathe Ciss'
]);

SELECT public.refresh_five_a_side_player_stats();
