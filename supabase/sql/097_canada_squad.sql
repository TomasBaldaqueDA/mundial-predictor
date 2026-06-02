-- Canada 2026 World Cup squad (26: 3 GK, 9 DF, 10 MD, 4 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Canada';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Maxime Crepeau', 'Canada', 'gk'),
  ('Owen Goodman', 'Canada', 'gk'),
  ('Dayne St. Clair', 'Canada', 'gk'),
  ('Moise Bombito', 'Canada', 'df'),
  ('Derek Cornelius', 'Canada', 'df'),
  ('Alphonso Davies', 'Canada', 'df'),
  ('Luc de Fougerolles', 'Canada', 'df'),
  ('Alistair Johnston', 'Canada', 'df'),
  ('Alfie Jones', 'Canada', 'df'),
  ('Richie Laryea', 'Canada', 'df'),
  ('Niko Sigur', 'Canada', 'df'),
  ('Joel Waterman', 'Canada', 'df'),
  ('Ali Ahmed', 'Canada', 'md'),
  ('Tajon Buchanan', 'Canada', 'md'),
  ('Mathieu Choiniere', 'Canada', 'md'),
  ('Stephen Eustaquio', 'Canada', 'md'),
  ('Marcelo Flores', 'Canada', 'md'),
  ('Ismael Kone', 'Canada', 'md'),
  ('Liam Millar', 'Canada', 'md'),
  ('Jonathan Osorio', 'Canada', 'md'),
  ('Nathan-Dylan Saliba', 'Canada', 'md'),
  ('Jacob Shaffelburg', 'Canada', 'md'),
  ('Jonathan David', 'Canada', 'st'),
  ('Promise David', 'Canada', 'st'),
  ('Cyle Larin', 'Canada', 'st'),
  ('Tani Oluwaseyi', 'Canada', 'st');

SELECT public.refresh_five_a_side_player_stats();
