-- Match 13: Spain 0-0 Cabo Verde (Group H, 15 Jun 2026)
-- MVP: Vozinha (SofaScore)
-- Lineups: SofaScore / Sportstar (Jun 15 2026)
-- Clean sheets (0-0): GK + DF who appeared — recalculated via refresh_five_a_side_player_stats()

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Vozinha'
WHERE id = 13;

-- Spain XI + subs (15): Yamal & Merino 71', Olmo 81', N. Williams 87'
SELECT public.add_match_appearances(13, 'Spain', ARRAY[
  'Unai Simón', 'Marcos Llorente', 'Aymeric Laporte', 'Pau Cubarsí', 'Marc Cucurella',
  'Fabián Ruiz', 'Gavi', 'Rodri', 'Pedri', 'Ferran Torres', 'Mikel Oyarzabal',
  'Lamine Yamal', 'Mikel Merino', 'Dani Olmo', 'Nico Williams'
]);

-- Cabo Verde XI + subs (16): Deroy Duarte, Semedo, Nuno Da Costa 61'; Joao Paulo 76'; Arcanjo 79'
-- Pico Lopes (SofaScore) = Roberto Lopes in squad
SELECT public.add_match_appearances(13, 'Cabo Verde', ARRAY[
  'Vozinha', 'Diney Borges', 'Roberto Lopes', 'Sidny Cabral', 'Steven Moreira',
  'Kevin Pina', 'Jovane Cabral', 'Jamiro Monteiro', 'Laros Duarte', 'Dailon Livramento', 'Ryan Mendes',
  'Deroy Duarte', 'Willy Semedo', 'Nuno Da Costa', 'Joao Paulo Fernandes', 'Telmo Arcanjo'
]);

SELECT public.refresh_five_a_side_player_stats();
