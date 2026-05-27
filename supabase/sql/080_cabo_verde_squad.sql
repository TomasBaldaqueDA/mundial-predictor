-- Cabo Verde 2026 World Cup squad (26: 3 GK, 9 DF, 6 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Cabo Verde';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Vozinha', 'Cabo Verde', 'gk'),
  ('Marcio Rosa', 'Cabo Verde', 'gk'),
  ('CJ Dos Santos', 'Cabo Verde', 'gk'),
  ('Diney Borges', 'Cabo Verde', 'df'),
  ('Sidny Cabral', 'Cabo Verde', 'df'),
  ('Logan Costa', 'Cabo Verde', 'df'),
  ('Steven Moreira', 'Cabo Verde', 'df'),
  ('Wagner Pina', 'Cabo Verde', 'df'),
  ('Joao Paulo Fernandes', 'Cabo Verde', 'df'),
  ('Roberto Lopes', 'Cabo Verde', 'df'),
  ('Kelvin Pires', 'Cabo Verde', 'df'),
  ('Ianique Dos Santos Tavares', 'Cabo Verde', 'df'),
  ('Telmo Arcanjo', 'Cabo Verde', 'md'),
  ('Laros Duarte', 'Cabo Verde', 'md'),
  ('Deroy Duarte', 'Cabo Verde', 'md'),
  ('Jamiro Monteiro', 'Cabo Verde', 'md'),
  ('Kevin Pina', 'Cabo Verde', 'md'),
  ('Yannick Semedo', 'Cabo Verde', 'md'),
  ('Gilson Benchimol', 'Cabo Verde', 'st'),
  ('Jovane Cabral', 'Cabo Verde', 'st'),
  ('Nuno Da Costa', 'Cabo Verde', 'st'),
  ('Dailon Livramento', 'Cabo Verde', 'st'),
  ('Ryan Mendes', 'Cabo Verde', 'st'),
  ('Garry Rodrigues', 'Cabo Verde', 'st'),
  ('Willy Semedo', 'Cabo Verde', 'st'),
  ('Helio Varela', 'Cabo Verde', 'st');

SELECT public.refresh_five_a_side_player_stats();
