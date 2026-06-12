-- Match 3: Canada 1-1 Bosnia and Herzegovina (Group B, 12 Jun 2026)
-- Goals: Jovo Lukic 21' | Cyle Larin 78'
-- Assists: Sead Kolašinac (Lukic), Promise David (Larin)
-- MVP: Ismael Kone

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Ismael Kone'
WHERE id = 3;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Jovo Lukic';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Cyle Larin';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Sead Kolašinac';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Canada' AND name = 'Promise David';

-- Appearances (XI + subs who entered) — drives GP / wins / clean sheets / MVP
SELECT public.add_match_appearances(3, 'Canada', ARRAY[
  'Maxime Crepeau', 'Richie Laryea', 'Derek Cornelius', 'Luc de Fougerolles', 'Alistair Johnston',
  'Liam Millar', 'Stephen Eustaquio', 'Ismael Kone', 'Tajon Buchanan', 'Tani Oluwaseyi', 'Jonathan David',
  'Ali Ahmed', 'Jacob Shaffelburg', 'Promise David', 'Cyle Larin', 'Jonathan Osorio'
]);

SELECT public.add_match_appearances(3, 'Bosnia and Herzegovina', ARRAY[
  'Nikola Vasilj', 'Amar Dedić', 'Nikola Katić', 'Tarik Muharemović', 'Sead Kolašinac',
  'Esmir Bajraktarevic', 'Benjamin Tahirovic', 'Ivan Basic', 'Amar Memic', 'Ermedin Demirovic', 'Jovo Lukic',
  'Armin Gigovic', 'Samed Bazdar', 'Ivan Sunjic', 'Kerim Alajbegovic', 'Dzenis Burnic'
]);

SELECT public.refresh_five_a_side_player_stats();
