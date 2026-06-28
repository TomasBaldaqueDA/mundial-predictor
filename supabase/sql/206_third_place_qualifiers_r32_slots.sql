-- Best 8 third-place groups (ranking: K, F, L, E, B, J, D, I)
-- Eliminated 3rd place: A (Korea Republic), C (Scotland), G (IR Iran), H (Uruguay)
-- Fill Round of 32 third-place slots (matches 75, 78, 79, 80, 81, 82, 85, 88)

DELETE FROM public.group_actual_third_place;

INSERT INTO public.group_actual_third_place (group_code) VALUES
  ('B'),
  ('D'),
  ('E'),
  ('F'),
  ('I'),
  ('J'),
  ('K'),
  ('L')
ON CONFLICT (group_code) DO NOTHING;

UPDATE public.matches SET team2 = 'Paraguay'
WHERE id = 75 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Sweden'
WHERE id = 78 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Ecuador'
WHERE id = 79 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Congo DR'
WHERE id = 80 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Senegal'
WHERE id = 81 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Bosnia and Herzegovina'
WHERE id = 82 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Algeria'
WHERE id = 85 AND stage = 'Round of 32';

UPDATE public.matches SET team2 = 'Ghana'
WHERE id = 88 AND stage = 'Round of 32';
