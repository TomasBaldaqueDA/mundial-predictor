-- USA 2026 World Cup squad (26: 3 GK, 10 DF, 6 MD, 7 ST). Official list with shirt numbers.

DELETE FROM public.five_a_side_players WHERE team = 'USA';

INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Matt Turner', 'USA', 'gk', 1),
  ('Sergiño Dest', 'USA', 'df', 2),
  ('Chris Richards', 'USA', 'df', 3),
  ('Tyler Adams', 'USA', 'md', 4),
  ('Antonee Robinson', 'USA', 'df', 5),
  ('Auston Trusty', 'USA', 'df', 6),
  ('Gio Reyna', 'USA', 'md', 7),
  ('Weston McKennie', 'USA', 'md', 8),
  ('Ricardo Pepi', 'USA', 'st', 9),
  ('Christian Pulisic', 'USA', 'st', 10),
  ('Brenden Aaronson', 'USA', 'st', 11),
  ('Miles Robinson', 'USA', 'df', 12),
  ('Tim Ream', 'USA', 'df', 13),
  ('Sebastian Berhalter', 'USA', 'md', 14),
  ('Cristian Roldan', 'USA', 'md', 15),
  ('Alex Freeman', 'USA', 'df', 16),
  ('Malik Tillman', 'USA', 'md', 17),
  ('Max Arfsten', 'USA', 'df', 18),
  ('Haji Wright', 'USA', 'st', 19),
  ('Folarin Balogun', 'USA', 'st', 20),
  ('Timothy Weah', 'USA', 'st', 21),
  ('Mark McKenzie', 'USA', 'df', 22),
  ('Joe Scally', 'USA', 'df', 23),
  ('Matt Freese', 'USA', 'gk', 24),
  ('Chris Brady', 'USA', 'gk', 25),
  ('Alejandro Zendejas', 'USA', 'st', 26);

SELECT public.refresh_five_a_side_player_stats();
