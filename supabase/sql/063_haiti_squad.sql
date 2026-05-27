-- Haiti 2026 World Cup squad (26: 3 GK, 8 DF, 6 MD, 9 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Haiti';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Johnny Placide', 'Haiti', 'gk'),
  ('Alexandre Pierre', 'Haiti', 'gk'),
  ('Josué Duverger', 'Haiti', 'gk'),
  ('Carlens Arcus', 'Haiti', 'df'),
  ('Wilguens Paugvain', 'Haiti', 'df'),
  ('Duke Lacroix', 'Haiti', 'df'),
  ('Martin Experience', 'Haiti', 'df'),
  ('JK Duverne', 'Haiti', 'df'),
  ('Ricardo Ade', 'Haiti', 'df'),
  ('Hannes Delcroix', 'Haiti', 'df'),
  ('Keeto Thermoncy', 'Haiti', 'df'),
  ('Leverton Pierre', 'Haiti', 'md'),
  ('Carl-Fred Sainthe', 'Haiti', 'md'),
  ('Jean-Jacques Danley', 'Haiti', 'md'),
  ('Jeanricner Bellegarde', 'Haiti', 'md'),
  ('Pierre Woodenski', 'Haiti', 'md'),
  ('Dominique Simon', 'Haiti', 'md'),
  ('Louicius Deedson', 'Haiti', 'st'),
  ('Ruben Providence', 'Haiti', 'st'),
  ('Josué Casimir', 'Haiti', 'st'),
  ('Derrick Etienne', 'Haiti', 'st'),
  ('Wilson Isidor', 'Haiti', 'st'),
  ('Duckens Nazon', 'Haiti', 'st'),
  ('Frantzdy Pierrot', 'Haiti', 'st'),
  ('Yassin Fortune', 'Haiti', 'st'),
  ('Lenny Joseph', 'Haiti', 'st');

SELECT public.refresh_five_a_side_player_stats();
