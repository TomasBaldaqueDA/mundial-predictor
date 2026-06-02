-- Paraguay 2026 World Cup squad (26: 3 GK, 8 DF, 8 MD, 7 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Paraguay';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Roberto Junior Fernandez', 'Paraguay', 'gk'),
  ('Orlando Gill', 'Paraguay', 'gk'),
  ('Gaston Olveira', 'Paraguay', 'gk'),
  ('Omar Alderete', 'Paraguay', 'df'),
  ('Junior Alonso', 'Paraguay', 'df'),
  ('Fabian Balbuena', 'Paraguay', 'df'),
  ('Juan Jose Caceres', 'Paraguay', 'df'),
  ('Jose Canale', 'Paraguay', 'df'),
  ('Gustavo Gomez', 'Paraguay', 'df'),
  ('Alexandro Maidana', 'Paraguay', 'df'),
  ('Gustavo Velazquez', 'Paraguay', 'df'),
  ('Damian Bobadilla', 'Paraguay', 'md'),
  ('Gustavo Caballero', 'Paraguay', 'md'),
  ('Andres Cubas', 'Paraguay', 'md'),
  ('Matias Galarza', 'Paraguay', 'md'),
  ('Diego Gomez', 'Paraguay', 'md'),
  ('Mauricio Magalhaes', 'Paraguay', 'md'),
  ('Briaian Ojeda', 'Paraguay', 'md'),
  ('Alejandro Romero', 'Paraguay', 'md'),
  ('Miguel Almiron', 'Paraguay', 'st'),
  ('Gabriel Avalos', 'Paraguay', 'st'),
  ('Alex Arce', 'Paraguay', 'st'),
  ('Julio Enciso', 'Paraguay', 'st'),
  ('Isidro Pitta', 'Paraguay', 'st'),
  ('Antonio Sanabria', 'Paraguay', 'st'),
  ('Ramon Sosa', 'Paraguay', 'st');

SELECT public.refresh_five_a_side_player_stats();
