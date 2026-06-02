-- Uruguay 2026 World Cup squad (26: 3 GK, 9 DF, 11 MD, 3 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Uruguay';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Sergio Rochet', 'Uruguay', 'gk'),
  ('Fernando Muslera', 'Uruguay', 'gk'),
  ('Santiago Mele', 'Uruguay', 'gk'),
  ('Guillermo Varela', 'Uruguay', 'df'),
  ('Ronald Araujo', 'Uruguay', 'df'),
  ('Jose Maria Gimenez', 'Uruguay', 'df'),
  ('Santiago Bueno', 'Uruguay', 'df'),
  ('Sebastian Caceres', 'Uruguay', 'df'),
  ('Mathias Olivera', 'Uruguay', 'df'),
  ('Joaquin Piquerez', 'Uruguay', 'df'),
  ('Matias Vina', 'Uruguay', 'df'),
  ('Juan Manuel Sanabria', 'Uruguay', 'df'),
  ('Manuel Ugarte', 'Uruguay', 'md'),
  ('Emiliano Martinez', 'Uruguay', 'md'),
  ('Rodrigo Bentancur', 'Uruguay', 'md'),
  ('Federico Valverde', 'Uruguay', 'md'),
  ('Agustin Canobbio', 'Uruguay', 'md'),
  ('Giorgian de Arrascaeta', 'Uruguay', 'md'),
  ('Nicolas de la Cruz', 'Uruguay', 'md'),
  ('Facundo Pellistri', 'Uruguay', 'md'),
  ('Rodrigo Zalazar', 'Uruguay', 'md'),
  ('Maxi Araujo', 'Uruguay', 'md'),
  ('Brian Rodriguez', 'Uruguay', 'md'),
  ('Rodrigo Aguirre', 'Uruguay', 'st'),
  ('Federico Vinas', 'Uruguay', 'st'),
  ('Darwin Nunez', 'Uruguay', 'st');

SELECT public.refresh_five_a_side_player_stats();
