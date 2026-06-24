-- Match 49: Switzerland 2-1 Canada (Group B, 24 Jun 2026)
-- Goals: Vargas 46' (assist Manzambi) | Manzambi 57' (assist Embolo) | David 76' (assist Saliba)
-- MVP: Johan Manzambi
-- Lineups: SofaScore (Jun 24 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 1,
  mvp    = 'Johan Manzambi'
WHERE id = 49;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Ruben Vargas';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Johan Manzambi';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Canada' AND name = 'Promise David';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Johan Manzambi';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Switzerland' AND name = 'Breel Embolo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Canada' AND name = 'Nathan-Dylan Saliba';

SELECT public.add_match_appearances(49, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Ricardo Rodriguez', 'Manuel Akanji', 'Nico Elvedi', 'Luca Jaquez',
  'Granit Xhaka', 'Remo Freuler', 'Ruben Vargas', 'Johan Manzambi', 'Djibril Sow', 'Breel Embolo',
  'Silvan Widmer', 'Michel Aebischer', 'Dan Ndoye', 'Christian Fassnacht', 'Cedric Itten'
]);

SELECT public.add_match_appearances(49, 'Canada', ARRAY[
  'Maxime Crepeau', 'Alistair Johnston', 'Luc de Fougerolles', 'Derek Cornelius', 'Richie Laryea',
  'Tajon Buchanan', 'Nathan-Dylan Saliba', 'Mathieu Choiniere', 'Ali Ahmed', 'Jonathan David', 'Cyle Larin',
  'Stephen Eustaquio', 'Liam Millar', 'Tani Oluwaseyi', 'Promise David', 'Jacob Shaffelburg'
]);

SELECT public.refresh_five_a_side_player_stats();
