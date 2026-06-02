-- Brazil 2026 World Cup squad (26: 3 GK, 9 DF, 5 MD, 9 ST). CBF shirt numbers May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Brazil';

INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Alisson', 'Brazil', 'gk', 1),
  ('Ederson', 'Brazil', 'gk', 23),
  ('Weverton', 'Brazil', 'gk', 12),
  ('Gleison Bremer', 'Brazil', 'df', 14),
  ('Danilo', 'Brazil', 'df', 13),
  ('Ibanez', 'Brazil', 'df', 24),
  ('Gabriel Magalhaes', 'Brazil', 'df', 3),
  ('Marquinhos', 'Brazil', 'df', 4),
  ('Leo Pereira', 'Brazil', 'df', 15),
  ('Alex Sandro', 'Brazil', 'df', 6),
  ('Douglas Santos', 'Brazil', 'df', 16),
  ('Wesley', 'Brazil', 'df', 2),
  ('Casemiro', 'Brazil', 'md', 5),
  ('Fabinho', 'Brazil', 'md', 17),
  ('Bruno Guimaraes', 'Brazil', 'md', 8),
  ('Lucas Paqueta', 'Brazil', 'md', 20),
  ('Danilo Santos', 'Brazil', 'md', 18),
  ('Matheus Cunha', 'Brazil', 'st', 9),
  ('Endrick', 'Brazil', 'st', 19),
  ('Luiz Henrique', 'Brazil', 'st', 21),
  ('Gabriel Martinelli', 'Brazil', 'st', 22),
  ('Neymar Jr', 'Brazil', 'st', 10),
  ('Raphinha', 'Brazil', 'st', 11),
  ('Rayan', 'Brazil', 'st', 26),
  ('Igor Thiago', 'Brazil', 'st', 25),
  ('Vinicius Jr', 'Brazil', 'st', 7);

SELECT public.refresh_five_a_side_player_stats();
