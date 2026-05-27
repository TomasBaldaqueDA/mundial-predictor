-- Colombia 2026 World Cup squad (26: 3 GK, 8 DF, 10 MD, 5 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Colombia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Alvaro Montero', 'Colombia', 'gk'),
  ('Camilo Vargas', 'Colombia', 'gk'),
  ('David Ospina', 'Colombia', 'gk'),
  ('Daniel Munoz', 'Colombia', 'df'),
  ('Santiago Arias', 'Colombia', 'df'),
  ('Davinson Sanchez', 'Colombia', 'df'),
  ('Jhon Lucumi', 'Colombia', 'df'),
  ('Yerry Mina', 'Colombia', 'df'),
  ('Willer Ditta', 'Colombia', 'df'),
  ('Deiver Machado', 'Colombia', 'df'),
  ('Johan Mojica', 'Colombia', 'df'),
  ('Gustavo Puerta', 'Colombia', 'md'),
  ('James Rodriguez', 'Colombia', 'md'),
  ('Jefferson Lerma', 'Colombia', 'md'),
  ('Jhon Arias', 'Colombia', 'md'),
  ('Jorge Carrascal', 'Colombia', 'md'),
  ('Juan Fernando Quintero', 'Colombia', 'md'),
  ('Richard Rios', 'Colombia', 'md'),
  ('Kevin Castano', 'Colombia', 'md'),
  ('Jaminton Campaz', 'Colombia', 'md'),
  ('Juan Portilla', 'Colombia', 'md'),
  ('Luis Diaz', 'Colombia', 'st'),
  ('Luis Suarez', 'Colombia', 'st'),
  ('Jhon Cordoba', 'Colombia', 'st'),
  ('Carlos Gomez', 'Colombia', 'st'),
  ('Juan Camilo Hernandez', 'Colombia', 'st');

SELECT public.refresh_five_a_side_player_stats();
