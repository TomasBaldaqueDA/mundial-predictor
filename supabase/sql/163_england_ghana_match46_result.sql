-- Match 46: England 0-0 Ghana (Group L, 23 Jun 2026)
-- MVP: Jude Bellingham
-- Lineups: SofaScore (Jun 23 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 0,
  score2 = 0,
  mvp    = 'Jude Bellingham'
WHERE id = 46;

SELECT public.add_match_appearances(46, 'England', ARRAY[
  'Jordan Pickford', 'Djed Spence', 'Marc Guehi', 'Ezri Konsa', 'Reece James',
  'Declan Rice', 'Elliott Anderson', 'Anthony Gordon', 'Jude Bellingham', 'Noni Madueke', 'Harry Kane',
  'Bukayo Saka', 'Nico O''Reilly', 'Morgan Rogers', 'Eberechi Eze', 'Marcus Rashford'
]);

SELECT public.add_match_appearances(46, 'Ghana', ARRAY[
  'Benjamin Asare', 'Marvin Senaya', 'Jonas Adjetey', 'Jerome Opoku', 'Gideon Mensah',
  'Thomas Partey', 'Inaki Williams', 'Caleb Yirenkyi', 'Kwasi Sibo', 'Antoine Semenyo', 'Jordan Ayew',
  'Abdul Fatawu Issahaku', 'Prince Kwabena Adu', 'Kojo Oppong Peprah', 'Baba Abdul Rahman'
]);

SELECT public.refresh_five_a_side_player_stats();
