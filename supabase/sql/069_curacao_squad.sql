-- Curaçao 2026 World Cup squad (26: 3 GK, 8 DF, 7 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Curaçao';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Tyrick Bodak', 'Curaçao', 'gk'),
  ('Trevor Doornbusch', 'Curaçao', 'gk'),
  ('Eloy Room', 'Curaçao', 'gk'),
  ('Riechedly Bazoer', 'Curaçao', 'df'),
  ('Joshua Brenet', 'Curaçao', 'df'),
  ('Roshon Van Eijma', 'Curaçao', 'df'),
  ('Sherel Floranus', 'Curaçao', 'df'),
  ('Deveron Fonville', 'Curaçao', 'df'),
  ('Jurien Gaari', 'Curaçao', 'df'),
  ('Armando Obispo', 'Curaçao', 'df'),
  ('Shurandy Sambo', 'Curaçao', 'df'),
  ('Juninho Bacuna', 'Curaçao', 'md'),
  ('Leandro Bacuna', 'Curaçao', 'md'),
  ('Livano Comenencia', 'Curaçao', 'md'),
  ('Kevin Felida', 'Curaçao', 'md'),
  ('Ar''jany Martha', 'Curaçao', 'md'),
  ('Tyrese Noslin', 'Curaçao', 'md'),
  ('Godfried Roemeratoe', 'Curaçao', 'md'),
  ('Jeremy Antonisse', 'Curaçao', 'st'),
  ('Tahith Chong', 'Curaçao', 'st'),
  ('Kenji Gorré', 'Curaçao', 'st'),
  ('Sontje Hansen', 'Curaçao', 'st'),
  ('Gervane Kastaneer', 'Curaçao', 'st'),
  ('Brandley Kuwas', 'Curaçao', 'st'),
  ('Jurgen Locadia', 'Curaçao', 'st'),
  ('Jearl Margaritha', 'Curaçao', 'st');

SELECT public.refresh_five_a_side_player_stats();
