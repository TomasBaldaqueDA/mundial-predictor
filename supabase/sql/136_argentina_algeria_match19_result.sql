-- Match 19: Argentina 3-0 Algeria (Group J, 17 Jun 2026)
-- Goals: Messi 17' (assist De Paul), 60', 76' (assist Gonzalez)
-- MVP: Lionel Messi
-- Lineups: SofaScore (Jun 17 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 0,
  mvp    = 'Lionel Messi'
WHERE id = 19;

UPDATE public.five_a_side_players SET goals = goals + 3
WHERE team = 'Argentina' AND name = 'Lionel Messi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Rodrigo De Paul';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Argentina' AND name = 'Nicolas Gonzalez';

SELECT public.add_match_appearances(19, 'Argentina', ARRAY[
  'Emiliano Martinez', 'Cristian Romero', 'Facundo Medina', 'Lisandro Martinez', 'Gonzalo Montiel',
  'Alexis Mac Allister', 'Enzo Fernandez', 'Thiago Almada', 'Rodrigo De Paul', 'Lautaro Martinez', 'Lionel Messi',
  'Nahuel Molina', 'Nicolas Gonzalez', 'Julian Alvarez', 'Nicolas Otamendi', 'Nicolas Paz'
]);

SELECT public.add_match_appearances(19, 'Algeria', ARRAY[
  'Luca Zidane', 'Rafik Belghali', 'Aissa Mandi', 'Ramy Bensebaini', 'Rayan Ait-Nouri',
  'Nabil Bentaleb', 'Hicham Boudaoui', 'Fares Chaibi', 'Ibrahim Maza', 'Anis Hadj Moussa', 'Amine Gouiri',
  'Houssem Aouar', 'Riyad Mahrez', 'Mohamed Amoura', 'Adil Boulbina', 'Ramiz Zerrouki'
]);

SELECT public.refresh_five_a_side_player_stats();
