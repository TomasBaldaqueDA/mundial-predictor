-- Mexico 2026 World Cup final squad (26: 3 GK, 6 DF, 10 MD, 7 ST). June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Mexico';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Guillermo Ochoa', 'Mexico', 'gk'),
  ('Raul Rangel', 'Mexico', 'gk'),
  ('Carlos Acevedo', 'Mexico', 'gk'),
  ('Cesar Montes', 'Mexico', 'df'),
  ('Johan Vasquez', 'Mexico', 'df'),
  ('Jorge Sanchez', 'Mexico', 'df'),
  ('Israel Reyes', 'Mexico', 'df'),
  ('Jesus Gallardo', 'Mexico', 'df'),
  ('Mateo Chavez', 'Mexico', 'df'),
  ('Edson Alvarez', 'Mexico', 'md'),
  ('Orbelin Pineda', 'Mexico', 'md'),
  ('Luis Chavez', 'Mexico', 'md'),
  ('Obed Vargas', 'Mexico', 'md'),
  ('Luis Romo', 'Mexico', 'md'),
  ('Gilberto Mora', 'Mexico', 'md'),
  ('Alvaro Fidalgo', 'Mexico', 'md'),
  ('Cesar Huerta', 'Mexico', 'md'),
  ('Brian Gutierrez', 'Mexico', 'md'),
  ('Erik Lira', 'Mexico', 'md'),
  ('Santiago Gimenez', 'Mexico', 'st'),
  ('Raul Jimenez', 'Mexico', 'st'),
  ('Julian Quinones', 'Mexico', 'st'),
  ('Roberto Alvarado', 'Mexico', 'st'),
  ('Alexis Vega', 'Mexico', 'st'),
  ('Guillermo Martinez', 'Mexico', 'st'),
  ('Armando Gonzalez', 'Mexico', 'st');

SELECT public.refresh_five_a_side_player_stats();
