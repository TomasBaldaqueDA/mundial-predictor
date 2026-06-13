-- Match 4: USA 4-1 Paraguay (Group D, 13 Jun 2026)
-- Goals: Bobadilla 7' (OG) | Balogun 31', 45+5 | Reyna 90+8 | Mauricio 73'
-- Assists: Pulisic (Balogun), Tillman (Balogun), Freeman (Reyna) | Enciso (Mauricio)
-- MVP: Folarin Balogun

UPDATE public.matches
SET
  status = 'finished',
  score1 = 4,
  score2 = 1,
  mvp    = 'Folarin Balogun'
WHERE id = 4;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'USA' AND name = 'Folarin Balogun';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Gio Reyna';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Paraguay' AND name = 'Mauricio Magalhaes';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'USA' AND name = 'Christian Pulisic';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'USA' AND name = 'Malik Tillman';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'USA' AND name = 'Alex Freeman';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Paraguay' AND name = 'Julio Enciso';

SELECT public.add_match_appearances(4, 'USA', ARRAY[
  'Matt Freese', 'Antonee Robinson', 'Tim Ream', 'Chris Richards', 'Alex Freeman',
  'Malik Tillman', 'Tyler Adams', 'Christian Pulisic', 'Weston McKennie', 'Sergiño Dest', 'Folarin Balogun',
  'Sebastian Berhalter', 'Timothy Weah', 'Ricardo Pepi', 'Gio Reyna'
]);

SELECT public.add_match_appearances(4, 'Paraguay', ARRAY[
  'Orlando Gill', 'Diego Gomez', 'Andres Cubas', 'Damian Bobadilla', 'Miguel Almiron',
  'Juan Jose Caceres', 'Gustavo Gomez', 'Omar Alderete', 'Junior Alonso', 'Antonio Sanabria', 'Julio Enciso',
  'Mauricio Magalhaes', 'Alex Arce', 'Gustavo Velazquez', 'Ramon Sosa', 'Alejandro Romero'
]);

SELECT public.refresh_five_a_side_player_stats();
