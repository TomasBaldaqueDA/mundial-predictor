-- Match 57: Japan 1-1 Sweden (Group F, 26 Jun 2026)
-- Goals: Maeda 56' (assist Doan) | Elanga 62' (assist Gyokeres)
-- MVP: Anthony Elanga
-- Lineups: SofaScore (Jun 26 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Anthony Elanga'
WHERE id = 57;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Daizen Maeda';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Sweden' AND name = 'Anthony Elanga';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Ritsu Doan';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Sweden' AND name = 'Viktor Gyokeres';

SELECT public.add_match_appearances(57, 'Japan', ARRAY[
  'Zion Suzuki', 'Hiroki Ito', 'Ko Itakura', 'Ayumu Seko', 'Keito Nakamura',
  'Daichi Kamada', 'Ao Tanaka', 'Yukinari Sugawara', 'Daizen Maeda', 'Ritsu Doan', 'Ayase Ueda',
  'Shogo Taniguchi', 'Koki Ogawa', 'Junya Ito', 'Tsuyoshi Watanabe', 'Yuto Nagatomo'
]);

SELECT public.add_match_appearances(57, 'Sweden', ARRAY[
  'Jacob Widell Zetterstrom', 'Gustaf Lagerbielke', 'Isak Hien', 'Gabriel Gudmundsson', 'Alexander Bernhardsson',
  'Victor Lindelof', 'Yasin Ayari', 'Elliot Stroud', 'Anthony Elanga', 'Viktor Gyokeres', 'Alexander Isak',
  'Lucas Bergvall', 'Daniel Svensson', 'Ken Sema', 'Carl Starfelt', 'Benjamin Nygren'
]);

SELECT public.refresh_five_a_side_player_stats();
