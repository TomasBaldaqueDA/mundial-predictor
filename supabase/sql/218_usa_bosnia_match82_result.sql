-- Match 82: USA 2-0 Bosnia and Herzegovina (Round of 32, 2 Jul 2026 — 1D vs 3B)
-- Goals: Balogun 45' | Tillman 82'
-- MVP: Malik Tillman
-- USA advances to Round of 16 (match 93 team2 = W82)
-- Lineups: SofaScore (Jul 2 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp       = 'Malik Tillman',
  qualifier = 'USA'
WHERE id = 82;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Folarin Balogun';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Malik Tillman';

UPDATE public.matches SET team2 = 'USA'
WHERE id = 93 AND stage = 'Round of 16';

SELECT public.add_match_appearances(82, 'USA', ARRAY[
  'Matt Freese', 'Antonee Robinson', 'Tim Ream', 'Chris Richards', 'Alex Freeman',
  'Malik Tillman', 'Tyler Adams', 'Weston McKennie', 'Christian Pulisic', 'Sergiño Dest', 'Folarin Balogun',
  'Sebastian Berhalter', 'Ricardo Pepi', 'Gio Reyna'
]);

SELECT public.add_match_appearances(82, 'Bosnia and Herzegovina', ARRAY[
  'Nikola Vasilj', 'Amar Dedić', 'Nikola Katić', 'Tarik Muharemović', 'Stjepan Radeljić', 'Sead Kolašinac',
  'Armin Gigovic', 'Ivan Sunjic', 'Kerim Alajbegovic', 'Edin Dzeko', 'Ermedin Demirovic',
  'Ermin Mahmic', 'Benjamin Tahirovic', 'Esmir Bajraktarevic', 'Amar Memic', 'Haris Tabakovic'
]);

SELECT public.refresh_five_a_side_player_stats();
