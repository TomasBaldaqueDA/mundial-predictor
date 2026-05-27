-- Netherlands 2026 World Cup squad (26: 3 GK, 7 DF, 8 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Netherlands';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Mark Flekken', 'Netherlands', 'gk'),
  ('Robin Roefs', 'Netherlands', 'gk'),
  ('Bart Verbruggen', 'Netherlands', 'gk'),
  ('Nathan Aké', 'Netherlands', 'df'),
  ('Virgil van Dijk', 'Netherlands', 'df'),
  ('Denzel Dumfries', 'Netherlands', 'df'),
  ('Jorrel Hato', 'Netherlands', 'df'),
  ('Jan Paul van Hecke', 'Netherlands', 'df'),
  ('Micky van de Ven', 'Netherlands', 'df'),
  ('Jurriën Timber', 'Netherlands', 'df'),
  ('Ryan Gravenberch', 'Netherlands', 'md'),
  ('Frenkie de Jong', 'Netherlands', 'md'),
  ('Teun Koopmeiners', 'Netherlands', 'md'),
  ('Tijjani Reijnders', 'Netherlands', 'md'),
  ('Marten de Roon', 'Netherlands', 'md'),
  ('Guus Til', 'Netherlands', 'md'),
  ('Quinten Timber', 'Netherlands', 'md'),
  ('Mats Wieffer', 'Netherlands', 'md'),
  ('Brian Brobbey', 'Netherlands', 'st'),
  ('Memphis Depay', 'Netherlands', 'st'),
  ('Cody Gakpo', 'Netherlands', 'st'),
  ('Justin Kluivert', 'Netherlands', 'st'),
  ('Noa Lang', 'Netherlands', 'st'),
  ('Donyell Malen', 'Netherlands', 'st'),
  ('Crysencio Summerville', 'Netherlands', 'st'),
  ('Wout Weghorst', 'Netherlands', 'st');

SELECT public.refresh_five_a_side_player_stats();
