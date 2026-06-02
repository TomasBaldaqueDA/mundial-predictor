-- Portugal 2026 World Cup final squad (26: 3 GK, 9 DF, 6 MD, 8 ST). FPF shirt numbers June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Portugal';

INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Diogo Costa', 'Portugal', 'gk', 1),
  ('Jose Sa', 'Portugal', 'gk', 12),
  ('Rui Silva', 'Portugal', 'gk', 22),
  ('Nelson Semedo', 'Portugal', 'df', 2),
  ('Ruben Dias', 'Portugal', 'df', 3),
  ('Tomas Araujo', 'Portugal', 'df', 4),
  ('Diogo Dalot', 'Portugal', 'df', 5),
  ('Matheus Nunes', 'Portugal', 'df', 6),
  ('Renato Veiga', 'Portugal', 'df', 13),
  ('Goncalo Inacio', 'Portugal', 'df', 14),
  ('Joao Cancelo', 'Portugal', 'df', 20),
  ('Nuno Mendes', 'Portugal', 'df', 25),
  ('Bruno Fernandes', 'Portugal', 'md', 8),
  ('Bernardo Silva', 'Portugal', 'md', 10),
  ('Joao Neves', 'Portugal', 'md', 15),
  ('Ruben Neves', 'Portugal', 'md', 21),
  ('Vitinha', 'Portugal', 'md', 23),
  ('Samuel Costa', 'Portugal', 'md', 24),
  ('Cristiano Ronaldo', 'Portugal', 'st', 7),
  ('Goncalo Ramos', 'Portugal', 'st', 9),
  ('Joao Felix', 'Portugal', 'st', 11),
  ('Francisco Trincao', 'Portugal', 'st', 16),
  ('Rafael Leao', 'Portugal', 'st', 17),
  ('Pedro Neto', 'Portugal', 'st', 18),
  ('Goncalo Guedes', 'Portugal', 'st', 19),
  ('Francisco Conceicao', 'Portugal', 'st', 26);

SELECT public.refresh_five_a_side_player_stats();
