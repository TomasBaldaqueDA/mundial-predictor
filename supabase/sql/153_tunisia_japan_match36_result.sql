-- Match 36: Tunisia 0-4 Japan (Group F, 21 Jun 2026)
-- Goals: Kamada 4' (assist Nakamura) | Ueda 31' (assist Itakura), 83' (assist Sano) | Ito 69' (assist Ueda)
-- MVP: Ayase Ueda
-- Lineups: SofaScore (Jun 21 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 4,
  mvp    = 'Ayase Ueda'
WHERE id = 36;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Daichi Kamada';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Ayase Ueda';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Ayase Ueda';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Japan' AND name = 'Junya Ito';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Keito Nakamura';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Ko Itakura';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Ayase Ueda';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Japan' AND name = 'Kaishu Sano';

SELECT public.add_match_appearances(36, 'Tunisia', ARRAY[
  'Aymen Dahmene', 'Omar Rekik', 'Montassar Talbi', 'Dylan Bronn', 'Ali Abdi',
  'Ellyes Skhiri', 'Anis Ben Slimane', 'Yan Valery', 'Hannibal Mejbri', 'Elias Saad', 'Sebastian Tounekti',
  'Mohamed Amine Ben Hamida', 'Ismael Gharbi', 'Firas Chaouat', 'Elias Achouri', 'Rani Khedira'
]);

SELECT public.add_match_appearances(36, 'Japan', ARRAY[
  'Zion Suzuki', 'Takehiro Tomiyasu', 'Ko Itakura', 'Hiroki Ito', 'Ritsu Doan',
  'Kaishu Sano', 'Ao Tanaka', 'Keito Nakamura', 'Junya Ito', 'Daichi Kamada', 'Ayase Ueda',
  'Junosuke Suzuki', 'Yukinari Sugawara', 'Ayumu Seko', 'Yuito Suzuki', 'Keisuke Goto'
]);

SELECT public.refresh_five_a_side_player_stats();
