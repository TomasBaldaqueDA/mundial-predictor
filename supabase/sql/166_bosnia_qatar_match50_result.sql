-- Match 50: Bosnia and Herzegovina 3-1 Qatar (Group B, 24 Jun 2026)
-- Goals: Alajbegovic 29' (assist Basic) | Abunada 34' (OG) | Haydos 42' (assist Junior) | Mahmic 80' (assist Hadzikadunic)
-- MVP: Kerim Alajbegovic
-- Lineups: SofaScore (Jun 24 2026); Malić (SofaScore) not in squad — Nihad Mujakić started at CB

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 1,
  mvp    = 'Kerim Alajbegovic'
WHERE id = 50;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Kerim Alajbegovic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Ermin Mahmic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Qatar' AND name = 'Hassan Al-Haydos';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Ivan Basic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Dennis Hadzikadunic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Qatar' AND name = 'Edmilson Junior';

SELECT public.add_match_appearances(50, 'Bosnia and Herzegovina', ARRAY[
  'Nikola Vasilj', 'Sead Kolašinac', 'Stjepan Radeljić', 'Nikola Katić', 'Nihad Mujakić',
  'Kerim Alajbegovic', 'Ivan Sunjic', 'Ivan Basic', 'Esmir Bajraktarevic', 'Edin Dzeko', 'Ermedin Demirovic',
  'Benjamin Tahirovic', 'Amar Memic', 'Dennis Hadzikadunic', 'Ermin Mahmic', 'Dzenis Burnic'
]);

SELECT public.add_match_appearances(50, 'Qatar', ARRAY[
  'Mahmoud Abunada', 'Pedro Miguel', 'Boualem Khoukhi', 'Issa Laaye', 'Sultan Al-Brake',
  'Edmilson Junior', 'Jassem Jaber', 'Ahmed Fathi', 'Akram Afif', 'Karim Boudiaf', 'Hassan Al-Haydos',
  'Abdulaziz Hatem', 'Ahmed Alaa', 'Almoez Ali', 'Mohammed Al-Manai'
]);

SELECT public.refresh_five_a_side_player_stats();
