-- Portugal: remove Ricardo Velho (not in final 26) + FPF World Cup 2026 shirt numbers.

DELETE FROM public.five_a_side_players
WHERE team = 'Portugal' AND name = 'Ricardo Velho';

UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Diogo Costa', 1),
  ('Nelson Semedo', 2),
  ('Ruben Dias', 3),
  ('Tomas Araujo', 4),
  ('Diogo Dalot', 5),
  ('Matheus Nunes', 6),
  ('Cristiano Ronaldo', 7),
  ('Bruno Fernandes', 8),
  ('Goncalo Ramos', 9),
  ('Bernardo Silva', 10),
  ('Joao Felix', 11),
  ('Jose Sa', 12),
  ('Renato Veiga', 13),
  ('Goncalo Inacio', 14),
  ('Joao Neves', 15),
  ('Francisco Trincao', 16),
  ('Rafael Leao', 17),
  ('Pedro Neto', 18),
  ('Goncalo Guedes', 19),
  ('Joao Cancelo', 20),
  ('Ruben Neves', 21),
  ('Rui Silva', 22),
  ('Vitinha', 23),
  ('Samuel Costa', 24),
  ('Nuno Mendes', 25),
  ('Francisco Conceicao', 26)
) AS v(name, num)
WHERE p.team = 'Portugal' AND p.name = v.name;
