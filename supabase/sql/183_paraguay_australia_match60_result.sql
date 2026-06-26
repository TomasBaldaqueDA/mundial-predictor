-- Match 60: Paraguay 0-0 Australia (Group D, 26 Jun 2026)
-- MVP: Aiden O'Neill
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Aiden O''Neill'
WHERE id = 60;

SELECT public.add_match_appearances(60, 'Paraguay', ARRAY[
  'Orlando Gill', 'Alexandro Maidana', 'Omar Alderete', 'Gustavo Gomez', 'Gustavo Velazquez', 'Juan Jose Caceres',
  'Matias Galarza', 'Andres Cubas', 'Diego Gomez', 'Julio Enciso', 'Gabriel Avalos',
  'Mauricio Magalhaes', 'Alex Arce', 'Jose Canale', 'Damian Bobadilla', 'Junior Alonso'
]);

SELECT public.add_match_appearances(60, 'Australia', ARRAY[
  'Patrick Beach', 'Alessandro Circati', 'Harry Souttar', 'Lucas Herrington', 'Jordan Bos',
  'Aiden O''Neill', 'Jackson Irvine', 'Aziz Behich', 'Cristian Volpato', 'Connor Metcalfe', 'Nestory Irankunda',
  'Ajdin Hrustic', 'Paul Okon-Engstler', 'Tete Yengi'
]);

SELECT public.refresh_five_a_side_player_stats();
