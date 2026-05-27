-- Bosnia and Herzegovina 2026 World Cup squad (26: 3 GK, 8 DF, 7 MD, 8 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Bosnia and Herzegovina';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Nikola Vasilj', 'Bosnia and Herzegovina', 'gk'),
  ('Osman Hadžikić', 'Bosnia and Herzegovina', 'gk'),
  ('Martin Zlomislić', 'Bosnia and Herzegovina', 'gk'),
  ('Sead Kolašinac', 'Bosnia and Herzegovina', 'df'),
  ('Amar Dedić', 'Bosnia and Herzegovina', 'df'),
  ('Nihad Mujakić', 'Bosnia and Herzegovina', 'df'),
  ('Nikola Katić', 'Bosnia and Herzegovina', 'df'),
  ('Tarik Muharemović', 'Bosnia and Herzegovina', 'df'),
  ('Stjepan Radeljić', 'Bosnia and Herzegovina', 'df'),
  ('Dennis Hadzikadunic', 'Bosnia and Herzegovina', 'df'),
  ('Nidal Čelik', 'Bosnia and Herzegovina', 'df'),
  ('Amir Hadziahmetovic', 'Bosnia and Herzegovina', 'md'),
  ('Ivan Sunjic', 'Bosnia and Herzegovina', 'md'),
  ('Ivan Basic', 'Bosnia and Herzegovina', 'md'),
  ('Dzenis Burnic', 'Bosnia and Herzegovina', 'md'),
  ('Ermin Mahmic', 'Bosnia and Herzegovina', 'md'),
  ('Benjamin Tahirovic', 'Bosnia and Herzegovina', 'md'),
  ('Armin Gigovic', 'Bosnia and Herzegovina', 'md'),
  ('Amar Memic', 'Bosnia and Herzegovina', 'st'),
  ('Kerim Alajbegovic', 'Bosnia and Herzegovina', 'st'),
  ('Esmir Bajraktarevic', 'Bosnia and Herzegovina', 'st'),
  ('Ermedin Demirovic', 'Bosnia and Herzegovina', 'st'),
  ('Jovo Lukic', 'Bosnia and Herzegovina', 'st'),
  ('Samed Bazdar', 'Bosnia and Herzegovina', 'st'),
  ('Haris Tabakovic', 'Bosnia and Herzegovina', 'st'),
  ('Edin Dzeko', 'Bosnia and Herzegovina', 'st');

SELECT public.refresh_five_a_side_player_stats();
