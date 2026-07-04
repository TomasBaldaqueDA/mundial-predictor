-- Match 88 (FIFA M87): Colombia 1-0 Ghana (Round of 32, 4 Jul 2026 — 1K vs 3DEIJL)
-- Goal: Arias 14' (assist L. Suárez)
-- MVP: Luis Diaz
-- Colombia advances to Round of 16 (match 96 team2 = W87)
-- Lineups: SofaScore (Jul 4 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 0,
  mvp       = 'Luis Diaz',
  qualifier = 'Colombia'
WHERE id = 88;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Colombia' AND name = 'Jhon Arias';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Colombia' AND name = 'Luis Suarez';

UPDATE public.matches SET team2 = 'Colombia'
WHERE id = 96 AND stage = 'Round of 16';

SELECT public.add_match_appearances(88, 'Colombia', ARRAY[
  'Camilo Vargas', 'Johan Mojica', 'Jhon Lucumi', 'Davinson Sanchez', 'Daniel Munoz',
  'Jhon Arias', 'Jefferson Lerma', 'Gustavo Puerta', 'Luis Diaz', 'Jhon Cordoba', 'James Rodriguez',
  'Luis Suarez', 'Richard Rios', 'Juan Fernando Quintero', 'Jaminton Campaz'
]);

SELECT public.add_match_appearances(88, 'Ghana', ARRAY[
  'Lawrence Ati-Zigi', 'Marvin Senaya', 'Derrick Luckassen', 'Jerome Opoku', 'Gideon Mensah',
  'Thomas Partey', 'Inaki Williams', 'Caleb Yirenkyi', 'Kwasi Sibo', 'Antoine Semenyo', 'Jordan Ayew',
  'Alidu Seidu', 'Elisha Owusu', 'Abdul Fatawu Issahaku', 'Prince Kwabena Adu', 'Ernest Nuamah'
]);

SELECT public.refresh_five_a_side_player_stats();
