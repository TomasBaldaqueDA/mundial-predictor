-- France 2026 World Cup squad (26: 3 GK, 9 DF, 5 MD, 9 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'France';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Mike Maignan', 'France', 'gk'),
  ('Robin Risser', 'France', 'gk'),
  ('Brice Samba', 'France', 'gk'),
  ('Lucas Digne', 'France', 'df'),
  ('Malo Gusto', 'France', 'df'),
  ('Lucas Hernandez', 'France', 'df'),
  ('Theo Hernandez', 'France', 'df'),
  ('Ibrahima Konate', 'France', 'df'),
  ('Jules Kounde', 'France', 'df'),
  ('Maxence Lacroix', 'France', 'df'),
  ('William Saliba', 'France', 'df'),
  ('Dayot Upamecano', 'France', 'df'),
  ('N''Golo Kante', 'France', 'md'),
  ('Manu Kone', 'France', 'md'),
  ('Adrien Rabiot', 'France', 'md'),
  ('Aurelien Tchouameni', 'France', 'md'),
  ('Warren Zaire-Emery', 'France', 'md'),
  ('Maghnes Akliouche', 'France', 'st'),
  ('Bradley Barcola', 'France', 'st'),
  ('Rayan Cherki', 'France', 'st'),
  ('Ousmane Dembele', 'France', 'st'),
  ('Desire Doue', 'France', 'st'),
  ('Jean-Philippe Mateta', 'France', 'st'),
  ('Kylian Mbappe', 'France', 'st'),
  ('Michael Olise', 'France', 'st'),
  ('Marcus Thuram', 'France', 'st');

SELECT public.refresh_five_a_side_player_stats();
