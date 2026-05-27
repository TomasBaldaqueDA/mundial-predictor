-- Switzerland 2026 World Cup squad (26: 3 GK, 8 DF, 9 MD, 6 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Switzerland';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Gregor Kobel', 'Switzerland', 'gk'),
  ('Yvon Mvogo', 'Switzerland', 'gk'),
  ('Marvin Keller', 'Switzerland', 'gk'),
  ('Manuel Akanji', 'Switzerland', 'df'),
  ('Nico Elvedi', 'Switzerland', 'df'),
  ('Ricardo Rodriguez', 'Switzerland', 'df'),
  ('Silvan Widmer', 'Switzerland', 'df'),
  ('Miro Muheim', 'Switzerland', 'df'),
  ('Aurèle Amenda', 'Switzerland', 'df'),
  ('Eray Cömert', 'Switzerland', 'df'),
  ('Luca Jaquez', 'Switzerland', 'df'),
  ('Granit Xhaka', 'Switzerland', 'md'),
  ('Remo Freuler', 'Switzerland', 'md'),
  ('Denis Zakaria', 'Switzerland', 'md'),
  ('Ardon Jashari', 'Switzerland', 'md'),
  ('Djibril Sow', 'Switzerland', 'md'),
  ('Michel Aebischer', 'Switzerland', 'md'),
  ('Fabian Rieder', 'Switzerland', 'md'),
  ('Christian Fassnacht', 'Switzerland', 'md'),
  ('Johan Manzambi', 'Switzerland', 'md'),
  ('Breel Embolo', 'Switzerland', 'st'),
  ('Noah Okafor', 'Switzerland', 'st'),
  ('Dan Ndoye', 'Switzerland', 'st'),
  ('Zeki Amdouni', 'Switzerland', 'st'),
  ('Cedric Itten', 'Switzerland', 'st'),
  ('Ruben Vargas', 'Switzerland', 'st');

SELECT public.refresh_five_a_side_player_stats();
