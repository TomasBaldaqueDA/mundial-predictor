-- England 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'England';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Dean Henderson', 'England', 'gk'),
  ('Jordan Pickford', 'England', 'gk'),
  ('James Trafford', 'England', 'gk'),
  ('Dan Burn', 'England', 'df'),
  ('Marc Guehi', 'England', 'df'),
  ('Reece James', 'England', 'df'),
  ('Ezri Konsa', 'England', 'df'),
  ('Tino Livramento', 'England', 'df'),
  ('Nico O''Reilly', 'England', 'df'),
  ('Jarell Quansah', 'England', 'df'),
  ('Djed Spence', 'England', 'df'),
  ('John Stones', 'England', 'df'),
  ('Elliott Anderson', 'England', 'md'),
  ('Jude Bellingham', 'England', 'md'),
  ('Eberechi Eze', 'England', 'md'),
  ('Jordan Henderson', 'England', 'md'),
  ('Kobbie Mainoo', 'England', 'md'),
  ('Declan Rice', 'England', 'md'),
  ('Morgan Rogers', 'England', 'md'),
  ('Anthony Gordon', 'England', 'st'),
  ('Harry Kane', 'England', 'st'),
  ('Noni Madueke', 'England', 'st'),
  ('Marcus Rashford', 'England', 'st'),
  ('Bukayo Saka', 'England', 'st'),
  ('Ivan Toney', 'England', 'st'),
  ('Ollie Watkins', 'England', 'st');

SELECT public.refresh_five_a_side_player_stats();
