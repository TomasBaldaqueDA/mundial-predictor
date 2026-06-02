-- Brazil official World Cup 2026 shirt numbers (CBF, May 2026).

UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Alisson', 1),
  ('Wesley', 2),
  ('Gabriel Magalhaes', 3),
  ('Marquinhos', 4),
  ('Casemiro', 5),
  ('Alex Sandro', 6),
  ('Vinicius Jr', 7),
  ('Bruno Guimaraes', 8),
  ('Matheus Cunha', 9),
  ('Neymar Jr', 10),
  ('Raphinha', 11),
  ('Weverton', 12),
  ('Danilo', 13),
  ('Gleison Bremer', 14),
  ('Leo Pereira', 15),
  ('Douglas Santos', 16),
  ('Fabinho', 17),
  ('Danilo Santos', 18),
  ('Endrick', 19),
  ('Lucas Paqueta', 20),
  ('Luiz Henrique', 21),
  ('Gabriel Martinelli', 22),
  ('Ederson', 23),
  ('Ibanez', 24),
  ('Igor Thiago', 25),
  ('Rayan', 26)
) AS v(name, num)
WHERE p.team = 'Brazil' AND p.name = v.name;
