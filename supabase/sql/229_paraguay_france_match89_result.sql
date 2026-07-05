-- Match 89 (FIFA M89): Paraguay 0-1 France (Round of 16, 4 Jul 2026 — W74 vs W77)
-- Goal: Mbappe 70' (pen)
-- MVP: Orlando Gill (Paraguay)
-- France advances to Quarter-final (match 97 team1 = W89)
-- Lineups: SofaScore (Jul 4 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp       = 'Orlando Gill',
  qualifier = 'France'
WHERE id = 89;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.matches SET team1 = 'France'
WHERE id = 97 AND stage = 'Quarter-final';

SELECT public.add_match_appearances(89, 'Paraguay', ARRAY[
  'Orlando Gill', 'Junior Alonso', 'Omar Alderete', 'Gustavo Gomez', 'Gustavo Velazquez', 'Juan Jose Caceres',
  'Matias Galarza', 'Andres Cubas', 'Diego Gomez', 'Miguel Almiron', 'Julio Enciso',
  'Jose Canale', 'Gustavo Caballero', 'Gabriel Avalos', 'Mauricio Magalhaes'
]);

SELECT public.add_match_appearances(89, 'France', ARRAY[
  'Mike Maignan', 'Jules Kounde', 'Dayot Upamecano', 'William Saliba', 'Lucas Digne',
  'Manu Kone', 'Adrien Rabiot', 'Ousmane Dembele', 'Michael Olise', 'Bradley Barcola', 'Kylian Mbappe',
  'Desire Doue', 'Rayan Cherki'
]);

SELECT public.refresh_five_a_side_player_stats();
