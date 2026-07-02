-- Match 73: South Africa 0-1 Canada (Round of 32, 28 Jun 2026 — 2A vs 2B)
-- Goal: Stephen Eustaquio 90+2'
-- MVP: Stephen Eustaquio
-- Canada advances to Round of 16 (match 90 team1 = W73)
-- Lineups: SofaScore (Jun 28 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'Stephen Eustaquio'
WHERE id = 73;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Stephen Eustaquio';

UPDATE public.matches SET team1 = 'Canada'
WHERE id = 90 AND stage = 'Round of 16';

SELECT public.add_match_appearances(73, 'South Africa', ARRAY[
  'Ronwen Williams', 'Aubrey Modiba', 'Teboho Mokoena', 'Nkosinathi Sibisi', 'Mbekezeli Mbokazi',
  'Jayden Adams', 'Sphephelo Sithole', 'Relebohile Mofokeng', 'Oswin Appollis', 'Lyle Foster', 'Thapelo Maseko',
  'Thalente Mbatha', 'Tshepang Moremi', 'Iqraam Rayners', 'Evidence Makgopa', 'Khuliso Mudau'
]);

SELECT public.add_match_appearances(73, 'Canada', ARRAY[
  'Maxime Crepeau', 'Alistair Johnston', 'Moise Bombito', 'Derek Cornelius', 'Richie Laryea',
  'Tajon Buchanan', 'Stephen Eustaquio', 'Liam Millar', 'Nathan-Dylan Saliba', 'Tani Oluwaseyi', 'Jonathan David',
  'Luc de Fougerolles', 'Niko Sigur', 'Jacob Shaffelburg', 'Promise David', 'Alphonso Davies'
]);

SELECT public.refresh_five_a_side_player_stats();
