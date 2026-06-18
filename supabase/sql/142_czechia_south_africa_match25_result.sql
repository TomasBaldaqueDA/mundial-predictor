-- Match 25: Czechia 1-1 South Africa (Group A, 18 Jun 2026)
-- Goals: Sadilek 6' (assist Sojka) | Mokoena 83' (pen)
-- MVP: Ladislav Krejci
-- Lineups: SofaScore (Jun 18 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Ladislav Krejci'
WHERE id = 25;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Czechia' AND name = 'Michal Sadilek';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'South Africa' AND name = 'Teboho Mokoena';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Czechia' AND name = 'Alexandr Sojka';

SELECT public.add_match_appearances(25, 'Czechia', ARRAY[
  'Matej Kovar', 'Robin Hranac', 'David Zima', 'Tomas Holes', 'Vladimir Coufal', 'Ladislav Krejci',
  'Alexandr Sojka', 'Michal Sadilek', 'Vladimir Darida', 'Adam Hlozek', 'Patrik Schick',
  'Jaroslav Zeleny', 'Pavel Sulc', 'Tomas Soucek', 'Lukas Provod', 'Lukas Cerv'
]);

SELECT public.add_match_appearances(25, 'South Africa', ARRAY[
  'Ronwen Williams', 'Khuliso Mudau', 'Ime Okon', 'Mbekezeli Mbokazi', 'Aubrey Modiba',
  'Thalente Mbatha', 'Teboho Mokoena', 'Jayden Adams', 'Thapelo Maseko', 'Iqraam Rayners', 'Oswin Appollis',
  'Relebohile Mofokeng', 'Evidence Makgopa', 'Kamogelo Sebelebele'
]);

SELECT public.refresh_five_a_side_player_stats();
