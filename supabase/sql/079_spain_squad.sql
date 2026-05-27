-- Spain 2026 World Cup squad (26: 3 GK, 8 DF, 7 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Spain';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Unai Simón', 'Spain', 'gk'),
  ('David Raya', 'Spain', 'gk'),
  ('Joan García', 'Spain', 'gk'),
  ('Pedro Porro', 'Spain', 'df'),
  ('Marcos Llorente', 'Spain', 'df'),
  ('Aymeric Laporte', 'Spain', 'df'),
  ('Pau Cubarsí', 'Spain', 'df'),
  ('Marc Pubill', 'Spain', 'df'),
  ('Eric García', 'Spain', 'df'),
  ('Marc Cucurella', 'Spain', 'df'),
  ('Álejandro Grimaldo', 'Spain', 'df'),
  ('Rodri', 'Spain', 'md'),
  ('Martín Zubimendi', 'Spain', 'md'),
  ('Pedri', 'Spain', 'md'),
  ('Fabián Ruiz', 'Spain', 'md'),
  ('Mikel Merino', 'Spain', 'md'),
  ('Gavi', 'Spain', 'md'),
  ('Álex Baena', 'Spain', 'md'),
  ('Mikel Oyarzabal', 'Spain', 'st'),
  ('Lamine Yamal', 'Spain', 'st'),
  ('Ferran Torres', 'Spain', 'st'),
  ('Borja Iglesias', 'Spain', 'st'),
  ('Dani Olmo', 'Spain', 'st'),
  ('Víctor Muñoz', 'Spain', 'st'),
  ('Nico Williams', 'Spain', 'st'),
  ('Yéremy Pino', 'Spain', 'st');

SELECT public.refresh_five_a_side_player_stats();
