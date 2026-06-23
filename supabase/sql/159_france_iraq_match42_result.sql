-- Match 42: France 3-0 Iraq (Group I, 22 Jun 2026)
-- Goals: Mbappé 14' (assist Olise), 54' (assist Dembélé) | Dembélé 66' (assist Olise)
-- MVP: Kylian Mbappé
-- Lineups: SofaScore (Jun 22 2026); Hashem (SofaScore) = Akam Hashim in squad

UPDATE public.matches
SET
  status = 'finished',
  score1 = 3,
  score2 = 0,
  mvp    = 'Kylian Mbappe'
WHERE id = 42;

UPDATE public.five_a_side_players SET goals = goals + 2
WHERE team = 'France' AND name = 'Kylian Mbappe';

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

UPDATE public.five_a_side_players SET assists = assists + 2
WHERE team = 'France' AND name = 'Michael Olise';

UPDATE public.five_a_side_players SET assists = assists + 1
WHERE team = 'France' AND name = 'Ousmane Dembele';

SELECT public.add_match_appearances(42, 'France', ARRAY[
  'Mike Maignan', 'Lucas Digne', 'William Saliba', 'Dayot Upamecano', 'Jules Kounde',
  'Adrien Rabiot', 'Manu Kone', 'Bradley Barcola', 'Michael Olise', 'Ousmane Dembele', 'Kylian Mbappe',
  'Rayan Cherki', 'Desire Doue', 'Malo Gusto', 'Maghnes Akliouche', 'Marcus Thuram'
]);

SELECT public.add_match_appearances(42, 'Iraq', ARRAY[
  'Ahmed Basil', 'Hussein Ali', 'Zaid Tahseen', 'Akam Hashim', 'Merchas Doski',
  'Amir Al-Ammari', 'Ahmed Qasem', 'Zaid Ismail', 'Zidane Iqbal', 'Ibrahim Bayesh', 'Aymen Hussein',
  'Ali Al-Hamadi', 'Rebin Sulaka', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji'
]);

SELECT public.refresh_five_a_side_player_stats();
