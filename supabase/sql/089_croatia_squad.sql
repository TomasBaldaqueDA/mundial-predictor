-- Croatia 2026 World Cup squad (26: 3 GK, 7 DF, 10 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Croatia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Dominik Livakovic', 'Croatia', 'gk'),
  ('Dominik Kotarski', 'Croatia', 'gk'),
  ('Ivor Pandur', 'Croatia', 'gk'),
  ('Josko Gvardiol', 'Croatia', 'df'),
  ('Duje Caleta-Car', 'Croatia', 'df'),
  ('Josip Sutalo', 'Croatia', 'df'),
  ('Josip Stanisic', 'Croatia', 'df'),
  ('Marin Pongracic', 'Croatia', 'df'),
  ('Martin Erlic', 'Croatia', 'df'),
  ('Luka Vuskovic', 'Croatia', 'df'),
  ('Luka Modric', 'Croatia', 'md'),
  ('Mateo Kovacic', 'Croatia', 'md'),
  ('Mario Pasalic', 'Croatia', 'md'),
  ('Nikola Vlasic', 'Croatia', 'md'),
  ('Luka Sucic', 'Croatia', 'md'),
  ('Martin Baturina', 'Croatia', 'md'),
  ('Kristijan Jakic', 'Croatia', 'md'),
  ('Petar Sucic', 'Croatia', 'md'),
  ('Nikola Moro', 'Croatia', 'md'),
  ('Toni Fruk', 'Croatia', 'md'),
  ('Ivan Perisic', 'Croatia', 'st'),
  ('Andrej Kramaric', 'Croatia', 'st'),
  ('Ante Budimir', 'Croatia', 'st'),
  ('Marco Pasalic', 'Croatia', 'st'),
  ('Petar Musa', 'Croatia', 'st'),
  ('Igor Matanovic', 'Croatia', 'st');

SELECT public.refresh_five_a_side_player_stats();
