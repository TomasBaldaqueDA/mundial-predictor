-- Brazil 2026 World Cup squad (26: 3 GK, 9 DF, 5 MD, 9 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Brazil';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Alisson', 'Brazil', 'gk'),
  ('Ederson', 'Brazil', 'gk'),
  ('Weverton', 'Brazil', 'gk'),
  ('Gleison Bremer', 'Brazil', 'df'),
  ('Danilo', 'Brazil', 'df'),
  ('Ibanez', 'Brazil', 'df'),
  ('Gabriel Magalhaes', 'Brazil', 'df'),
  ('Marquinhos', 'Brazil', 'df'),
  ('Leo Pereira', 'Brazil', 'df'),
  ('Alex Sandro', 'Brazil', 'df'),
  ('Douglas Santos', 'Brazil', 'df'),
  ('Wesley', 'Brazil', 'df'),
  ('Casemiro', 'Brazil', 'md'),
  ('Fabinho', 'Brazil', 'md'),
  ('Bruno Guimaraes', 'Brazil', 'md'),
  ('Lucas Paqueta', 'Brazil', 'md'),
  ('Danilo Santos', 'Brazil', 'md'),
  ('Matheus Cunha', 'Brazil', 'st'),
  ('Endrick', 'Brazil', 'st'),
  ('Luiz Henrique', 'Brazil', 'st'),
  ('Gabriel Martinelli', 'Brazil', 'st'),
  ('Neymar Jr', 'Brazil', 'st'),
  ('Raphinha', 'Brazil', 'st'),
  ('Rayan', 'Brazil', 'st'),
  ('Igor Thiago', 'Brazil', 'st'),
  ('Vinicius Jr', 'Brazil', 'st');

SELECT public.refresh_five_a_side_player_stats();
