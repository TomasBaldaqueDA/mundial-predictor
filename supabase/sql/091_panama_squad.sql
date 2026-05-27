-- Panama 2026 World Cup squad (26: 3 GK, 10 DF, 9 MD, 4 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Panama';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Orlando Mosquera', 'Panama', 'gk'),
  ('Luis Mejia', 'Panama', 'gk'),
  ('Cesar Samudio', 'Panama', 'gk'),
  ('Cesar Blackman', 'Panama', 'df'),
  ('Jorge Gutierrez', 'Panama', 'df'),
  ('Amir Murillo', 'Panama', 'df'),
  ('Fidel Escobar', 'Panama', 'df'),
  ('Andres Andrade', 'Panama', 'df'),
  ('Edgardo Farina', 'Panama', 'df'),
  ('Jose Cordoba', 'Panama', 'df'),
  ('Eric Davis', 'Panama', 'df'),
  ('Jiovany Ramos', 'Panama', 'df'),
  ('Roderick Miller', 'Panama', 'df'),
  ('Anibal Godoy', 'Panama', 'md'),
  ('Adalberto Carrasquilla', 'Panama', 'md'),
  ('Carlos Harvey', 'Panama', 'md'),
  ('Cristian Martinez', 'Panama', 'md'),
  ('Jose Luis Rodriguez', 'Panama', 'md'),
  ('Cesar Yanis', 'Panama', 'md'),
  ('Yoel Barcenas', 'Panama', 'md'),
  ('Alberto Quintero', 'Panama', 'md'),
  ('Azarias Londono', 'Panama', 'md'),
  ('Ismael Diaz', 'Panama', 'st'),
  ('Cecilio Waterman', 'Panama', 'st'),
  ('Jose Fajardo', 'Panama', 'st'),
  ('Tomas Rodriguez', 'Panama', 'st');

SELECT public.refresh_five_a_side_player_stats();
