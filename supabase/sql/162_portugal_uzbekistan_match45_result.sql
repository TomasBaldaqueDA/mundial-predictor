-- Match 45: Portugal 5-0 Uzbekistan (Group K, 23 Jun 2026)
-- Goals: Ronaldo 6' (assist Cancelo), 39' (assist Fernandes) | Mendes 17' | Nematov 60' (OG) | Leao 87'
-- MVP: Cristiano Ronaldo
-- Lineups: SofaScore (Jun 23 2026); Alizhonov (SofaScore) = Khojiakbar Alijonov in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 5,
  score2 = 0,
  mvp    = 'Cristiano Ronaldo'
WHERE id = 45;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'Portugal' AND name = 'Cristiano Ronaldo';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Portugal' AND name = 'Nuno Mendes';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'Portugal' AND name = 'Rafael Leao';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Portugal' AND name = 'Joao Cancelo';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'Portugal' AND name = 'Bruno Fernandes';

SELECT public.add_match_appearances(45, 'Portugal', ARRAY[
  'Diogo Costa', 'Nuno Mendes', 'Renato Veiga', 'Ruben Dias', 'Joao Cancelo',
  'Vitinha', 'Joao Neves', 'Joao Felix', 'Bruno Fernandes', 'Pedro Neto', 'Cristiano Ronaldo',
  'Nelson Semedo', 'Francisco Conceicao', 'Francisco Trincao', 'Bernardo Silva', 'Rafael Leao'
]);

SELECT public.add_match_appearances(45, 'Uzbekistan', ARRAY[
  'Abduvohid Nematov', 'Abdukodir Khusanov', 'Abdulla Abdullaev', 'Rustam Ashurmatov', 'Bekhruz Karimov',
  'Khojiakbar Alijonov', 'Akmal Mozgovoy', 'Azizjon Ganiev', 'Igor Sergeev', 'Eldor Shomurodov', 'Otabek Shukurov',
  'Sherzod Nasrullaev', 'Odiljon Hamrobekov', 'Abbosbek Fayzullaev', 'Sherzod Esanov'
]);

SELECT public.refresh_five_a_side_player_stats();
