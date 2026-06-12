-- Match 2: Korea Republic 2-1 Czechia (Group A, 12 Jun 2026)
-- Goals: Hwang In-beom 67', Oh Hyeong-yu 80' | Ladislav Krejci 59'
-- Assists: Lee Kan-gin (In-beom), Hwang In-beom (Oh)
-- MVP: Hwang In-beom

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Hwang In-beom'
WHERE id = 2;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Korea Republic' AND name = 'Hwang In-beom';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Korea Republic' AND name = 'Oh Hyeong-yu';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Czechia' AND name = 'Ladislav Krejci';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Korea Republic' AND name = 'Lee Kan-gin';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Korea Republic' AND name = 'Hwang In-beom';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Czechia' AND name = 'Vladimir Coufal';

SELECT public.refresh_five_a_side_player_stats();
