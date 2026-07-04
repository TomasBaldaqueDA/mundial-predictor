-- Match 86 (FIFA M88): Australia 1-1 Egypt, PSO 2-4 (Round of 32, 3 Jul 2026 — 2D vs 2G)
-- 90': Ashour 13' (assist Hafez) | Hany 55' (OG)
-- MVP: Mohamed Salah
-- Games score = 90' (1-1); qualifier = Egypt. Five-a-side goals include OG; no wins (draw at 90').
-- Egypt advances to Round of 16 (match 95 team2 = W88, FIFA M88)
-- Lineups: SofaScore (Jul 3 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp       = 'Mohamed Salah',
  qualifier = 'Egypt'
WHERE id = 86;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Emam Ashour';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Egypt' AND name = 'Mohamed Hany';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Egypt' AND name = 'Karim Hafez';

UPDATE public.matches SET team2 = 'Egypt'
WHERE id = 95 AND stage = 'Round of 16';

SELECT public.add_match_appearances(86, 'Australia', ARRAY[
  'Patrick Beach', 'Harry Souttar', 'Alessandro Circati', 'Lucas Herrington',
  'Aziz Behich', 'Aiden O''Neill', 'Jackson Irvine', 'Jordan Bos',
  'Connor Metcalfe', 'Cristian Volpato', 'Nestory Irankunda',
  'Kai Trewin', 'Mohamed Toure', 'Ajdin Hrustic', 'Awer Mabil', 'Paul Okon-Engstler', 'Maty Ryan'
]);

SELECT public.add_match_appearances(86, 'Egypt', ARRAY[
  'Mostafa Shobeir', 'Mohamed Hany', 'Yasser Ibrahim', 'Ramy Rabia', 'Karim Hafez',
  'Emam Ashour', 'Hamdi Fathy', 'Marwan Attia', 'Omar Marmoush', 'Mohamed Salah', 'Mostafa Ziko',
  'Hossam Abdelmaguid', 'Haitham Hassan', 'Mahmoud Trezeguet', 'Hamza Abdel Karim', 'Mahmoud Saber'
]);

SELECT public.refresh_five_a_side_player_stats();
