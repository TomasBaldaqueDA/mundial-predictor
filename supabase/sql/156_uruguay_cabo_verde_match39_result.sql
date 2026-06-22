-- Match 39: Uruguay 2-2 Cabo Verde (Group H, 21 Jun 2026)
-- Goals: Pina 21' | Araujo 44' | Canobbio 45+6 (assist Araujo) | Varela 61'
-- MVP: Kevin Pina
-- Lineups: SofaScore (Jun 21 2026); Lenini (SofaScore) = Kevin Pina in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 2,
  mvp    = 'Kevin Pina'
WHERE id = 39;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Cabo Verde' AND name = 'Kevin Pina';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Uruguay' AND name = 'Maxi Araujo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Uruguay' AND name = 'Agustin Canobbio';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Cabo Verde' AND name = 'Helio Varela';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Uruguay' AND name = 'Maxi Araujo';

SELECT public.add_match_appearances(39, 'Uruguay', ARRAY[
  'Fernando Muslera', 'Guillermo Varela', 'Sebastian Caceres', 'Mathias Olivera', 'Matias Vina',
  'Nicolas de la Cruz', 'Rodrigo Bentancur', 'Federico Valverde', 'Agustin Canobbio', 'Maxi Araujo', 'Darwin Nunez',
  'Manuel Ugarte', 'Federico Vinas', 'Juan Manuel Sanabria', 'Brian Rodriguez', 'Rodrigo Aguirre'
]);

SELECT public.add_match_appearances(39, 'Cabo Verde', ARRAY[
  'Vozinha', 'Steven Moreira', 'Sidny Cabral', 'Diney Borges', 'Roberto Lopes', 'Jamiro Monteiro',
  'Kevin Pina', 'Telmo Arcanjo', 'Garry Rodrigues', 'Ianique Dos Santos Tavares', 'Ryan Mendes',
  'Deroy Duarte', 'Nuno Da Costa', 'Helio Varela', 'Laros Duarte', 'Yannick Semedo'
]);

SELECT public.refresh_five_a_side_player_stats();
