-- Match 74: Brazil 2-1 Japan (Round of 32, 29 Jun 2026 — 1C vs 2F)
-- Goals: Sano 29' | Casemiro 56' (assist Magalhaes) | Martinelli 90+5' (assist Guimaraes)
-- MVP: Casemiro
-- Brazil advances to Round of 16 (match 91 team1 = W76, FIFA M76)
-- Lineups: SofaScore (Jun 29 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Casemiro'
WHERE id = 74;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Casemiro';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Gabriel Martinelli';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Kaishu Sano';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Gabriel Magalhaes';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Bruno Guimaraes';

UPDATE public.matches SET team1 = 'Brazil'
WHERE id = 91 AND stage = 'Round of 16';

SELECT public.add_match_appearances(74, 'Brazil', ARRAY[
  'Alisson', 'Douglas Santos', 'Gabriel Magalhaes', 'Marquinhos', 'Danilo',
  'Lucas Paqueta', 'Casemiro', 'Bruno Guimaraes', 'Vinicius Jr', 'Matheus Cunha', 'Rayan',
  'Endrick', 'Gabriel Martinelli', 'Fabinho', 'Danilo Santos'
]);

SELECT public.add_match_appearances(74, 'Japan', ARRAY[
  'Zion Suzuki', 'Takehiro Tomiyasu', 'Shogo Taniguchi', 'Hiroki Ito', 'Ritsu Doan',
  'Kaishu Sano', 'Daichi Kamada', 'Keito Nakamura', 'Junya Ito', 'Daizen Maeda', 'Ayase Ueda',
  'Yukinari Sugawara', 'Junosuke Suzuki', 'Ao Tanaka', 'Koki Ogawa'
]);

SELECT public.refresh_five_a_side_player_stats();
