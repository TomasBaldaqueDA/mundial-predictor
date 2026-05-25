-- Spain 2026 World Cup squad (26 players: 3 GK, 8 DF, 8 MD, 7 ST).
-- Picks referencing removed Spain players are cleared (ON DELETE SET NULL).

DELETE FROM public.five_a_side_players WHERE team = 'Spain';

INSERT INTO public.five_a_side_players (name, team, position, photo_url) VALUES
  ('Unai Simón', 'Spain', 'gk', '/imgs_cartoons/Spain/Unai%20Sim%C3%B3n.jpg'),
  ('David Raya', 'Spain', 'gk', '/imgs_cartoons/Spain/David%20Raya.jpg'),
  ('Joan García', 'Spain', 'gk', NULL),
  ('Marc Cucurella', 'Spain', 'df', '/imgs_cartoons/Spain/Marc%20Cucurella.jpg'),
  ('Pau Cubarsí', 'Spain', 'df', '/imgs_cartoons/Spain/Pau%20Cubars%C3%AD.jpg'),
  ('Aymeric Laporte', 'Spain', 'df', '/imgs_cartoons/Spain/Aymeric%20Laporte.jpg'),
  ('Álejandro Grimaldo', 'Spain', 'df', NULL),
  ('Pedro Porro', 'Spain', 'df', '/imgs_cartoons/Spain/Pedro%20Porro.jpg'),
  ('Eric García', 'Spain', 'df', NULL),
  ('Marcos Llorente', 'Spain', 'df', NULL),
  ('Marc Pubill', 'Spain', 'df', NULL),
  ('Gavi', 'Spain', 'md', NULL),
  ('Rodri', 'Spain', 'md', '/imgs_cartoons/Spain/Rodri.jpg'),
  ('Pedri', 'Spain', 'md', '/imgs_cartoons/Spain/Pedri.jpg'),
  ('Martín Zubimendi', 'Spain', 'md', NULL),
  ('Fabián Ruiz', 'Spain', 'md', NULL),
  ('Álex Baena', 'Spain', 'md', NULL),
  ('Mikel Merino', 'Spain', 'md', NULL),
  ('Dani Olmo', 'Spain', 'md', '/imgs_cartoons/Spain/Dani%20Olmo.jpg'),
  ('Lamine Yamal', 'Spain', 'st', '/imgs_cartoons/Spain/Lamine%20Yamal.jpg'),
  ('Nico Williams', 'Spain', 'st', NULL),
  ('Ferran Torres', 'Spain', 'st', '/imgs_cartoons/Spain/Ferran%20Torres.jpg'),
  ('Mikel Oyarzabal', 'Spain', 'st', '/imgs_cartoons/Spain/Mikel%20Oyarzabal.jpg'),
  ('Yéremy Pino', 'Spain', 'st', NULL),
  ('Borja Iglesias', 'Spain', 'st', NULL),
  ('Víctor Muñoz', 'Spain', 'st', NULL);

SELECT public.refresh_five_a_side_player_stats();
