-- Tunisia 2026 World Cup squad (26: 3 GK, 9 DF, 7 MD, 7 ST). Official list May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Tunisia';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Sabri Ben Hassan', 'Tunisia', 'gk'),
  ('Abdelmouhib Chamakh', 'Tunisia', 'gk'),
  ('Aymen Dahmene', 'Tunisia', 'gk'),
  ('Ali Abdi', 'Tunisia', 'df'),
  ('Mohamed Amine Ben Hamida', 'Tunisia', 'df'),
  ('Adem Arous', 'Tunisia', 'df'),
  ('Dylan Bronn', 'Tunisia', 'df'),
  ('Raed Chikhaoui', 'Tunisia', 'df'),
  ('Moutaz Neffati', 'Tunisia', 'df'),
  ('Omar Rekik', 'Tunisia', 'df'),
  ('Montassar Talbi', 'Tunisia', 'df'),
  ('Yan Valery', 'Tunisia', 'df'),
  ('Mortadha Ben Ouanes', 'Tunisia', 'md'),
  ('Anis Ben Slimane', 'Tunisia', 'md'),
  ('Ismael Gharbi', 'Tunisia', 'md'),
  ('Rani Khedira', 'Tunisia', 'md'),
  ('Hadj Mahmoud', 'Tunisia', 'md'),
  ('Hannibal Mejbri', 'Tunisia', 'md'),
  ('Ellyes Skhiri', 'Tunisia', 'md'),
  ('Elias Achouri', 'Tunisia', 'st'),
  ('Khalil Ayari', 'Tunisia', 'st'),
  ('Firas Chaouat', 'Tunisia', 'st'),
  ('Rayan Elloumi', 'Tunisia', 'st'),
  ('Hazem Mastouri', 'Tunisia', 'st'),
  ('Elias Saad', 'Tunisia', 'st'),
  ('Sebastian Tounekti', 'Tunisia', 'st');

SELECT public.refresh_five_a_side_player_stats();
