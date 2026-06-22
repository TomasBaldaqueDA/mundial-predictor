-- Match 38: Belgium 0-0 IR Iran (Group G, 21 Jun 2026)
-- MVP: Alireza Beiranvand
-- Lineups: SofaScore (Jun 21 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Alireza Beiranvand'
WHERE id = 38;

SELECT public.add_match_appearances(38, 'Belgium', ARRAY[
  'Thibaut Courtois', 'Maxim De Cuyper', 'Brandon Mechele', 'Nathan Ngoy', 'Thomas Meunier',
  'Youri Tielemans', 'Nicolas Raskin', 'Leandro Trossard', 'Kevin De Bruyne', 'Alexis Saelemaekers', 'Romelu Lukaku',
  'Timothy Castagne', 'Hans Vanaken', 'Dodi Lukebakio', 'Arthur Theate', 'Matias Fernandez-Pardo'
]);

SELECT public.add_match_appearances(38, 'IR Iran', ARRAY[
  'Alireza Beiranvand', 'Ehsan Hajsafi', 'Ali Nemati', 'Shoja Khalilzadeh', 'Hossein Kanaani', 'Saleh Hardani',
  'Mohammad Mohebi', 'Saeid Ezatolahi', 'Saman Ghoddos', 'Ramin Rezaeian', 'Mehdi Taremi',
  'Alireza Jahanbakhsh', 'Milad Mohammadi', 'Mehdi Torabi', 'Shahriar Moghanlou', 'Amirhossein Hosseinzadeh'
]);

SELECT public.refresh_five_a_side_player_stats();
