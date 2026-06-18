-- Match 26: Switzerland 4-1 Bosnia and Herzegovina (Group B, 18 Jun 2026)
-- Goals: Manzambi 74', 90' (assist Vargas) | Vargas 84' (assist Embolo) | Xhaka 90+7 (pen)
--        Mahmic 90+3
-- MVP: Johan Manzambi
-- Lineups: SofaScore (Jun 18 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 1,
  mvp    = 'Johan Manzambi'
WHERE id = 26;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Johan Manzambi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Johan Manzambi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Ruben Vargas';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Granit Xhaka';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Bosnia and Herzegovina' AND name = 'Ermin Mahmic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Breel Embolo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Ruben Vargas';

SELECT public.add_match_appearances(26, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Nico Elvedi', 'Manuel Akanji', 'Ricardo Rodriguez', 'Silvan Widmer',
  'Michel Aebischer', 'Granit Xhaka', 'Remo Freuler', 'Fabian Rieder', 'Breel Embolo', 'Dan Ndoye',
  'Djibril Sow', 'Johan Manzambi', 'Ruben Vargas', 'Luca Jaquez', 'Cedric Itten'
]);

SELECT public.add_match_appearances(26, 'Bosnia and Herzegovina', ARRAY[
  'Nikola Vasilj', 'Amar Dedić', 'Nikola Katić', 'Tarik Muharemović', 'Sead Kolašinac',
  'Ivan Sunjic', 'Benjamin Tahirovic', 'Amar Memic', 'Ermedin Demirovic', 'Edin Dzeko', 'Kerim Alajbegovic',
  'Ivan Basic', 'Esmir Bajraktarevic', 'Amir Hadziahmetovic', 'Jovo Lukic', 'Ermin Mahmic'
]);

SELECT public.refresh_five_a_side_player_stats();
