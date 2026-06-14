-- Match 5: Qatar 1-1 Switzerland (Group B, 13 Jun 2026)
-- Goals: Embolo 17' (pen) | Muheim 90+4' (OG)
-- MVP: Mahmoud Abunada

UPDATE public.matches
SET
  status = 'finished',
  score1 = 1,
  score2 = 1,
  mvp    = 'Mahmoud Abunada'
WHERE id = 5;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Switzerland' AND name = 'Breel Embolo';

SELECT public.add_match_appearances(5, 'Qatar', ARRAY[
  'Mahmoud Abunada', 'Homam Al-Amin', 'Boualem Khoukhi', 'Pedro Miguel', 'Ayoub Alawi',
  'Issa Laaye', 'Assim Madibo', 'Jassem Jaber', 'Akram Afif', 'Youssef Abdulrazzaq', 'Edmilson Junior',
  'Ahmed Fathi', 'Karim Boudiaf', 'Ahmed Alaa', 'Mohammed Al-Manai', 'Hassan Al-Haydos'
]);

SELECT public.add_match_appearances(5, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Denis Zakaria', 'Nico Elvedi', 'Manuel Akanji', 'Ricardo Rodriguez',
  'Michel Aebischer', 'Granit Xhaka', 'Remo Freuler', 'Dan Ndoye', 'Breel Embolo', 'Ruben Vargas',
  'Fabian Rieder', 'Johan Manzambi', 'Zeki Amdouni', 'Miro Muheim', 'Ardon Jashari'
]);

SELECT public.refresh_five_a_side_player_stats();
