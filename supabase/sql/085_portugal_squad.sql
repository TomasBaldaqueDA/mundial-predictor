-- Portugal 2026 World Cup squad (27: 4 GK, 9 DF, 6 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Portugal';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Diogo Costa', 'Portugal', 'gk'),
  ('Jose Sa', 'Portugal', 'gk'),
  ('Rui Silva', 'Portugal', 'gk'),
  ('Ricardo Velho', 'Portugal', 'gk'),
  ('Tomas Araujo', 'Portugal', 'df'),
  ('Joao Cancelo', 'Portugal', 'df'),
  ('Diogo Dalot', 'Portugal', 'df'),
  ('Ruben Dias', 'Portugal', 'df'),
  ('Goncalo Inacio', 'Portugal', 'df'),
  ('Nuno Mendes', 'Portugal', 'df'),
  ('Matheus Nunes', 'Portugal', 'df'),
  ('Nelson Semedo', 'Portugal', 'df'),
  ('Renato Veiga', 'Portugal', 'df'),
  ('Samuel Costa', 'Portugal', 'md'),
  ('Bruno Fernandes', 'Portugal', 'md'),
  ('Joao Neves', 'Portugal', 'md'),
  ('Ruben Neves', 'Portugal', 'md'),
  ('Bernardo Silva', 'Portugal', 'md'),
  ('Vitinha', 'Portugal', 'md'),
  ('Francisco Conceicao', 'Portugal', 'st'),
  ('Joao Felix', 'Portugal', 'st'),
  ('Goncalo Guedes', 'Portugal', 'st'),
  ('Rafael Leao', 'Portugal', 'st'),
  ('Pedro Neto', 'Portugal', 'st'),
  ('Goncalo Ramos', 'Portugal', 'st'),
  ('Cristiano Ronaldo', 'Portugal', 'st'),
  ('Francisco Trincao', 'Portugal', 'st');

SELECT public.refresh_five_a_side_player_stats();
