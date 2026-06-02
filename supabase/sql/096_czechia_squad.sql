-- Czechia 2026 World Cup squad (26: 3 GK, 9 DF, 9 MD, 5 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Czechia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Lukas Hornicek', 'Czechia', 'gk'),
  ('Matej Kovar', 'Czechia', 'gk'),
  ('Jindrich Stanek', 'Czechia', 'gk'),
  ('Vladimir Coufal', 'Czechia', 'df'),
  ('David Doudera', 'Czechia', 'df'),
  ('Tomas Holes', 'Czechia', 'df'),
  ('Robin Hranac', 'Czechia', 'df'),
  ('Stepan Chaloupek', 'Czechia', 'df'),
  ('David Jurasek', 'Czechia', 'df'),
  ('Ladislav Krejci', 'Czechia', 'df'),
  ('Jaroslav Zeleny', 'Czechia', 'df'),
  ('David Zima', 'Czechia', 'df'),
  ('Lukas Cerv', 'Czechia', 'md'),
  ('Vladimir Darida', 'Czechia', 'md'),
  ('Lukas Provod', 'Czechia', 'md'),
  ('Michal Sadilek', 'Czechia', 'md'),
  ('Hugo Sochurek', 'Czechia', 'md'),
  ('Alexandr Sojka', 'Czechia', 'md'),
  ('Tomas Soucek', 'Czechia', 'md'),
  ('Pavel Sulc', 'Czechia', 'md'),
  ('Denis Visinsky', 'Czechia', 'md'),
  ('Adam Hlozek', 'Czechia', 'st'),
  ('Tomas Chory', 'Czechia', 'st'),
  ('Mojmir Chytil', 'Czechia', 'st'),
  ('Jan Kuchta', 'Czechia', 'st'),
  ('Patrik Schick', 'Czechia', 'st');

SELECT public.refresh_five_a_side_player_stats();
