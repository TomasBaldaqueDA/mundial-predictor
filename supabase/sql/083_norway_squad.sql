-- Norway 2026 World Cup squad (26: 3 GK, 9 DF, 11 MD, 3 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Norway';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Orjan Haskjold Nyland', 'Norway', 'gk'),
  ('Egil Selvik', 'Norway', 'gk'),
  ('Sander Tangvik', 'Norway', 'gk'),
  ('Kristoffer Vassbakk Ajer', 'Norway', 'df'),
  ('Fredrik Bjorkan', 'Norway', 'df'),
  ('Henrik Falchener', 'Norway', 'df'),
  ('Sondre Langas', 'Norway', 'df'),
  ('Torbjorn Heggem', 'Norway', 'df'),
  ('Marcus Holmgren Pedersen', 'Norway', 'df'),
  ('Julian Ryerson', 'Norway', 'df'),
  ('David Moller Wolfe', 'Norway', 'df'),
  ('Leo Ostigard', 'Norway', 'df'),
  ('Thelonious Aasgaard', 'Norway', 'md'),
  ('Fredrik Aursnes', 'Norway', 'md'),
  ('Patrick Berg', 'Norway', 'md'),
  ('Sander Berge', 'Norway', 'md'),
  ('Oscar Bobb', 'Norway', 'md'),
  ('Jens Petter Hauge', 'Norway', 'md'),
  ('Antonio Nusa', 'Norway', 'md'),
  ('Andreas Schjelderup', 'Norway', 'md'),
  ('Morten Thorsby', 'Norway', 'md'),
  ('Kristian Thorstvedt', 'Norway', 'md'),
  ('Martin Odegaard', 'Norway', 'md'),
  ('Erling Haaland', 'Norway', 'st'),
  ('Jorgen Strand Larsen', 'Norway', 'st'),
  ('Alexander Sorloth', 'Norway', 'st');

SELECT public.refresh_five_a_side_player_stats();
