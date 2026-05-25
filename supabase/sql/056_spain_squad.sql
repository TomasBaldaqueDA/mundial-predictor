-- Spain 2026 World Cup squad (26 players: 3 GK, 8 DF, 8 MD, 7 ST). No player photos.

DELETE FROM public.five_a_side_players WHERE team = 'Spain';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Unai Simón', 'Spain', 'gk'),
  ('David Raya', 'Spain', 'gk'),
  ('Joan García', 'Spain', 'gk'),
  ('Marc Cucurella', 'Spain', 'df'),
  ('Pau Cubarsí', 'Spain', 'df'),
  ('Aymeric Laporte', 'Spain', 'df'),
  ('Álejandro Grimaldo', 'Spain', 'df'),
  ('Pedro Porro', 'Spain', 'df'),
  ('Eric García', 'Spain', 'df'),
  ('Marcos Llorente', 'Spain', 'df'),
  ('Marc Pubill', 'Spain', 'df'),
  ('Gavi', 'Spain', 'md'),
  ('Rodri', 'Spain', 'md'),
  ('Pedri', 'Spain', 'md'),
  ('Martín Zubimendi', 'Spain', 'md'),
  ('Fabián Ruiz', 'Spain', 'md'),
  ('Álex Baena', 'Spain', 'md'),
  ('Mikel Merino', 'Spain', 'md'),
  ('Dani Olmo', 'Spain', 'md'),
  ('Lamine Yamal', 'Spain', 'st'),
  ('Nico Williams', 'Spain', 'st'),
  ('Ferran Torres', 'Spain', 'st'),
  ('Mikel Oyarzabal', 'Spain', 'st'),
  ('Yéremy Pino', 'Spain', 'st'),
  ('Borja Iglesias', 'Spain', 'st'),
  ('Víctor Muñoz', 'Spain', 'st');

SELECT public.refresh_five_a_side_player_stats();
