-- Match 51: Scotland 0-3 Brazil (Group C, 24 Jun 2026)
-- Goals: Vinicius Jr 7' (assist Rayan), 45+3 (assist Guimaraes) | Cunha 60' (assist Guimaraes)
-- MVP: Vinicius Jr
-- Lineups: SofaScore (Jun 24 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 3,
  mvp    = 'Vinicius Jr'
WHERE id = 51;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Brazil' AND name = 'Vinicius Jr';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Brazil' AND name = 'Matheus Cunha';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Brazil' AND name = 'Rayan';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'Brazil' AND name = 'Bruno Guimaraes';

SELECT public.add_match_appearances(51, 'Scotland', ARRAY[
  'Angus Gunn', 'Nathan Patterson', 'Jack Hendry', 'Scott McKenna', 'Andy Robertson',
  'Lewis Ferguson', 'Scott McTominay', 'Ben Gannon-Doak', 'Kenny McLean', 'John McGinn', 'Lawrence Shankland',
  'Kieran Tierney', 'Anthony Ralston', 'Ryan Christie', 'Findlay Curtis', 'Che Adams'
]);

SELECT public.add_match_appearances(51, 'Brazil', ARRAY[
  'Alisson', 'Danilo', 'Marquinhos', 'Gabriel Magalhaes', 'Douglas Santos',
  'Bruno Guimaraes', 'Casemiro', 'Lucas Paqueta', 'Rayan', 'Matheus Cunha', 'Vinicius Jr',
  'Fabinho', 'Gabriel Martinelli', 'Neymar Jr', 'Endrick', 'Alex Sandro'
]);

SELECT public.refresh_five_a_side_player_stats();
