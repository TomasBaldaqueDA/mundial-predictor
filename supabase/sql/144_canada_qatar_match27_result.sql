-- Match 27: Canada 6-0 Qatar (Group B, 18 Jun 2026)
-- Goals: Larin 16' | David 29', 45+3, 90+2 (assist Saliba) | Saliba 64' | Al-Manai 75' (OG, uncredited)
-- MVP: Jonathan David
-- Lineups: SofaScore (Jun 18 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 6,
  score2 = 0,
  mvp    = 'Jonathan David'
WHERE id = 27;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Cyle Larin';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Jonathan David';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Jonathan David';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Jonathan David';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Nathan-Dylan Saliba';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Canada' AND name = 'Nathan-Dylan Saliba';

SELECT public.add_match_appearances(27, 'Canada', ARRAY[
  'Maxime Crepeau', 'Richie Laryea', 'Derek Cornelius', 'Luc de Fougerolles', 'Alistair Johnston',
  'Ali Ahmed', 'Stephen Eustaquio', 'Ismael Kone', 'Tajon Buchanan', 'Cyle Larin', 'Jonathan David',
  'Moise Bombito', 'Nathan-Dylan Saliba', 'Jacob Shaffelburg', 'Tani Oluwaseyi', 'Niko Sigur'
]);

SELECT public.add_match_appearances(27, 'Qatar', ARRAY[
  'Mahmoud Abunada', 'Ahmed Alaa', 'Pedro Miguel', 'Boualem Khoukhi', 'Homam Al-Amin',
  'Edmilson Junior', 'Jassem Jaber', 'Assim Madibo', 'Youssef Abdulrazzaq', 'Akram Afif', 'Issa Laaye',
  'Sultan Al-Brake', 'Ahmed Fathi', 'Mohammed Al-Manai', 'Hashmi Hussein', 'Lucas Mendes'
]);

SELECT public.refresh_five_a_side_player_stats();
