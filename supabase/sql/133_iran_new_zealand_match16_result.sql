-- Match 16: IR Iran 2-2 New Zealand (Group G, 16 Jun 2026)
-- Goals: Rezaeian 32' | Mohebi 64' (assist Rezaeian) | Just 7' & 54' (assists Wood)
-- MVP: Ramin Rezaeian
-- Lineups: SofaScore (Jun 16 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 2,
  mvp    = 'Ramin Rezaeian'
WHERE id = 16;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'IR Iran' AND name = 'Ramin Rezaeian';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'IR Iran' AND name = 'Mohammad Mohebi';

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'New Zealand' AND name = 'Eli Just';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'IR Iran' AND name = 'Ramin Rezaeian';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'New Zealand' AND name = 'Chris Wood';

SELECT public.add_match_appearances(16, 'IR Iran', ARRAY[
  'Alireza Beiranvand', 'Milad Mohammadi', 'Ali Nemati', 'Shoja Khalilzadeh', 'Ramin Rezaeian',
  'Aria Yousefi', 'Saeid Ezatolahi', 'Saman Ghoddos', 'Mohammad Mohebi', 'Mehdi Taremi', 'Shahriar Moghanlou',
  'Mehdi Ghaedi', 'Ali Alipour', 'Ehsan Hajsafi', 'Amirhossein Hosseinzadeh'
]);

SELECT public.add_match_appearances(16, 'New Zealand', ARRAY[
  'Max Crocombe', 'Tim Payne', 'Finn Surman', 'Michael Boxall', 'Liberato Cacace',
  'Joe Bell', 'Marko Stamenic', 'Callum McCowatt', 'Sarpreet Singh', 'Eli Just', 'Chris Wood',
  'Ben Old', 'Ryan Thomas', 'Callan Elliot', 'Tyler Bindon', 'Jesse Randall'
]);

SELECT public.refresh_five_a_side_player_stats();
