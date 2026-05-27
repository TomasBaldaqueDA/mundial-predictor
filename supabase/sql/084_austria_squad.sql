-- Austria 2026 World Cup squad (26: 3 GK, 9 DF, 11 MD, 3 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Austria';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Patrick Pentz', 'Austria', 'gk'),
  ('Alexander Schlager', 'Austria', 'gk'),
  ('Florian Wiegele', 'Austria', 'gk'),
  ('David Affengruber', 'Austria', 'df'),
  ('David Alaba', 'Austria', 'df'),
  ('Kevin Danso', 'Austria', 'df'),
  ('Marco Friedl', 'Austria', 'df'),
  ('Philipp Lienhart', 'Austria', 'df'),
  ('Phillipp Mwene', 'Austria', 'df'),
  ('Stefan Posch', 'Austria', 'df'),
  ('Alexander Prass', 'Austria', 'df'),
  ('Michael Svoboda', 'Austria', 'df'),
  ('Christoph Baumgartner', 'Austria', 'md'),
  ('Carney Chukwuemeka', 'Austria', 'md'),
  ('Florian Grillitsch', 'Austria', 'md'),
  ('Konrad Laimer', 'Austria', 'md'),
  ('Marcel Sabitzer', 'Austria', 'md'),
  ('Xaver Schlager', 'Austria', 'md'),
  ('Romano Schmid', 'Austria', 'md'),
  ('Alessandro Schopf', 'Austria', 'md'),
  ('Nicolas Seiwald', 'Austria', 'md'),
  ('Paul Wanner', 'Austria', 'md'),
  ('Patrick Wimmer', 'Austria', 'md'),
  ('Marko Arnautovic', 'Austria', 'st'),
  ('Michael Gregoritsch', 'Austria', 'st'),
  ('Sasa Kalajdzic', 'Austria', 'st');

SELECT public.refresh_five_a_side_player_stats();
