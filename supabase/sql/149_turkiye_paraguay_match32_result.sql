-- Match 32: Türkiye 0-1 Paraguay (Group D, 20 Jun 2026)
-- Goals: Galarza 2' (assist Enciso)
-- MVP: Matias Galarza
-- Lineups: SofaScore (Jun 20 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 1,
  mvp    = 'Matias Galarza'
WHERE id = 32;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Paraguay' AND name = 'Matias Galarza';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Paraguay' AND name = 'Julio Enciso';

SELECT public.add_match_appearances(32, 'Türkiye', ARRAY[
  'Ugurcan Cakir', 'Ferdi Kadioglu', 'Abdulkerim Bardakci', 'Merih Demiral', 'Mert Muldur',
  'Ismail Yuksek', 'Hakan Calhanoglu', 'Kenan Yildiz', 'Arda Guler', 'Yunus Akgun', 'Kerem Akturkoglu',
  'Baris Alper Yilmaz', 'Can Uzun', 'Deniz Gul', 'Eren Elmali', 'Orkun Kokcu'
]);

SELECT public.add_match_appearances(32, 'Paraguay', ARRAY[
  'Orlando Gill', 'Juan Jose Caceres', 'Gustavo Gomez', 'Omar Alderete', 'Junior Alonso',
  'Miguel Almiron', 'Andres Cubas', 'Diego Gomez', 'Matias Galarza', 'Isidro Pitta', 'Julio Enciso',
  'Damian Bobadilla', 'Gustavo Velazquez', 'Alexandro Maidana', 'Gabriel Avalos', 'Jose Canale'
]);

SELECT public.refresh_five_a_side_player_stats();
