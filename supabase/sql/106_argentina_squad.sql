-- Argentina 2026 World Cup squad (26: 3 GK, 8 DF, 7 MD, 8 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Argentina';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Emiliano Martinez', 'Argentina', 'gk'),
  ('Juan Musso', 'Argentina', 'gk'),
  ('Geronimo Rulli', 'Argentina', 'gk'),
  ('Leonardo Balerdi', 'Argentina', 'df'),
  ('Lisandro Martinez', 'Argentina', 'df'),
  ('Facundo Medina', 'Argentina', 'df'),
  ('Nahuel Molina', 'Argentina', 'df'),
  ('Gonzalo Montiel', 'Argentina', 'df'),
  ('Nicolas Otamendi', 'Argentina', 'df'),
  ('Cristian Romero', 'Argentina', 'df'),
  ('Nicolas Tagliafico', 'Argentina', 'df'),
  ('Valentin Barco', 'Argentina', 'md'),
  ('Rodrigo De Paul', 'Argentina', 'md'),
  ('Enzo Fernandez', 'Argentina', 'md'),
  ('Giovani Lo Celso', 'Argentina', 'md'),
  ('Alexis Mac Allister', 'Argentina', 'md'),
  ('Exequiel Palacios', 'Argentina', 'md'),
  ('Leandro Paredes', 'Argentina', 'md'),
  ('Thiago Almada', 'Argentina', 'st'),
  ('Julian Alvarez', 'Argentina', 'st'),
  ('Nicolas Gonzalez', 'Argentina', 'st'),
  ('Jose Manuel Lopez', 'Argentina', 'st'),
  ('Lautaro Martinez', 'Argentina', 'st'),
  ('Lionel Messi', 'Argentina', 'st'),
  ('Nicolas Paz', 'Argentina', 'st'),
  ('Giuliano Simeone', 'Argentina', 'st');

SELECT public.refresh_five_a_side_player_stats();
