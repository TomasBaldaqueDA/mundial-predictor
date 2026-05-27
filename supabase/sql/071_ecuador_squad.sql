-- Ecuador 2026 World Cup squad (26: 3 GK, 9 DF, 8 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Ecuador';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Hernán Galíndez', 'Ecuador', 'gk'),
  ('Moises Ramírez', 'Ecuador', 'gk'),
  ('Diego Cabezas', 'Ecuador', 'gk'),
  ('Piero Hincapié', 'Ecuador', 'df'),
  ('William Pacho', 'Ecuador', 'df'),
  ('Felix Torres', 'Ecuador', 'df'),
  ('José Ordóñez', 'Ecuador', 'df'),
  ('Pervis Estupiñán', 'Ecuador', 'df'),
  ('Ángelo Preciado', 'Ecuador', 'df'),
  ('John Hurtado', 'Ecuador', 'df'),
  ('José Chávez', 'Ecuador', 'df'),
  ('Xavier Arreaga', 'Ecuador', 'df'),
  ('Kendry Páez', 'Ecuador', 'md'),
  ('Alan Franco', 'Ecuador', 'md'),
  ('Pedro Vite', 'Ecuador', 'md'),
  ('Gonzalo Plata', 'Ecuador', 'md'),
  ('Jeremy Yeboah', 'Ecuador', 'md'),
  ('Junior Méndez', 'Ecuador', 'md'),
  ('Antonio Minda', 'Ecuador', 'md'),
  ('Diego Castillo', 'Ecuador', 'md'),
  ('Enner Valencia', 'Ecuador', 'st'),
  ('Kevin Rodríguez', 'Ecuador', 'st'),
  ('Leonardo Campana', 'Ecuador', 'st'),
  ('Jeremy Caicedo', 'Ecuador', 'st'),
  ('Nelson Angulo', 'Ecuador', 'st'),
  ('Jhon Corozo', 'Ecuador', 'st');

SELECT public.refresh_five_a_side_player_stats();
