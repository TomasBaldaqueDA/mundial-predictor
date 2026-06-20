-- Match 29: USA 2-0 Australia (Group D, 19 Jun 2026)
-- Goals: Burgess 11' (OG, uncredited) | Freeman 43'
-- MVP: Folarin Balogun
-- Lineups: SofaScore (Jun 19 2026)

UPDATE public.matches
SET
  status = 'finished',
  score1 = 2,
  score2 = 0,
  mvp    = 'Folarin Balogun'
WHERE id = 29;

UPDATE public.five_a_side_players SET goals = goals + 1
WHERE team = 'USA' AND name = 'Alex Freeman';

SELECT public.add_match_appearances(29, 'USA', ARRAY[
  'Matt Freese', 'Tim Ream', 'Chris Richards', 'Alex Freeman', 'Antonee Robinson',
  'Malik Tillman', 'Tyler Adams', 'Weston McKennie', 'Sergiño Dest', 'Ricardo Pepi', 'Folarin Balogun',
  'Sebastian Berhalter', 'Joe Scally', 'Auston Trusty', 'Haji Wright', 'Gio Reyna'
]);

SELECT public.add_match_appearances(29, 'Australia', ARRAY[
  'Patrick Beach', 'Jacob Italiano', 'Alessandro Circati', 'Harry Souttar', 'Cameron Burgess', 'Jordan Bos',
  'Mathew Leckie', 'Aiden O''Neill', 'Paul Okon-Engstler', 'Nishan Velupillay', 'Mohamed Toure',
  'Jason Geria', 'Connor Metcalfe', 'Nestory Irankunda', 'Cristian Volpato', 'Jackson Irvine'
]);

SELECT public.refresh_five_a_side_player_stats();
