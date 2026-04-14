-- Test matches for 5-A-SIDE / player stats testing.
-- Teams: Portugal, Norway, Brazil, Argentina, Austria.
-- Date: 14/03/2026 09:00, status: finished.

INSERT INTO public.matches (team1, team2, kickoff_time, status, "group", stage, score1, score2, mvp) VALUES
  ('Portugal', 'Norway',   '2026-03-14 09:00:00', 'finished', 'K', 'First Stage', 2, 1, 'Portugal ST 1'),
  ('Brazil',   'Argentina', '2026-03-14 09:00:00', 'finished', 'J', 'First Stage', 1, 2, 'Argentina MD 1'),
  ('Austria',  'Portugal',  '2026-03-14 09:00:00', 'finished', 'K', 'First Stage', 0, 1, 'Portugal GK 1');
