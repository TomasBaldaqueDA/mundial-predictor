-- 114: 2026 final-squad reconciliation.
-- Replaces players dropped from the official 26-man lists with their call-ups,
-- fixes a couple of jersey numbers/names, and trims Egypt from 27 to 26.
-- Diffed team-by-team against the official Sporting News rosters; unchanged
-- teams already matched the DB (numbers from migration 112), so they are left as-is.

-- Bosnia and Herzegovina: reserve GK Osman Hadzikic out, Mladen Jurkas in
DELETE FROM public.five_a_side_players WHERE team = 'Bosnia and Herzegovina' AND name = 'Osman Hadžikić';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Mladen Jurkas', 'Bosnia and Herzegovina', 'gk', 12);

-- Brazil: Wesley out, Ederson (Atalanta midfielder, #2) in
DELETE FROM public.five_a_side_players WHERE team = 'Brazil' AND name = 'Wesley';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Ederson', 'Brazil', 'md', 2);

-- Colombia: #26 is Andres Gomez (was stored as Carlos Gomez)
DELETE FROM public.five_a_side_players WHERE team = 'Colombia' AND name = 'Carlos Gomez';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Andres Gomez', 'Colombia', 'st', 26);

-- Cote d'Ivoire: Clement Akpa out, Christopher Operi in (#13)
DELETE FROM public.five_a_side_players WHERE team = 'Côte d''Ivoire' AND name = 'Clement Akpa';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Christopher Operi', 'Côte d''Ivoire', 'df', 13);

-- Curacao: reserve GK shirt numbers swapped (Bodak 26, Doornbusch 25)
UPDATE public.five_a_side_players SET jersey_number = 26 WHERE team = 'Curaçao' AND name = 'Tyrick Bodak';
UPDATE public.five_a_side_players SET jersey_number = 25 WHERE team = 'Curaçao' AND name = 'Trevor Doornbusch';

-- Ecuador: final squad call-ups (provisional names replaced) + spelling fixes
DELETE FROM public.five_a_side_players WHERE team = 'Ecuador' AND name IN (
  'John Hurtado','José Chávez','Diego Cabezas','Xavier Arreaga','Leonardo Campana','Junior Méndez','Jhon Corozo'
);
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Jordy Alcivar', 'Ecuador', 'md', 5),
  ('Anthony Valencia', 'Ecuador', 'md', 8),
  ('Gonzalo Valle', 'Ecuador', 'gk', 22),
  ('Moises Caicedo', 'Ecuador', 'md', 23),
  ('Jeremy Arevalo', 'Ecuador', 'st', 24),
  ('Jackson Porozo', 'Ecuador', 'df', 25),
  ('Yaimar Medina', 'Ecuador', 'md', 26);
UPDATE public.five_a_side_players SET name = 'Joel Ordonez'  WHERE team = 'Ecuador' AND name = 'José Ordóñez';
UPDATE public.five_a_side_players SET name = 'John Yeboah'   WHERE team = 'Ecuador' AND name = 'Jeremy Yeboah';
UPDATE public.five_a_side_players SET name = 'Alan Minda'    WHERE team = 'Ecuador' AND name = 'Antonio Minda';
UPDATE public.five_a_side_players SET name = 'Jordy Caicedo' WHERE team = 'Ecuador' AND name = 'Jeremy Caicedo';
UPDATE public.five_a_side_players SET name = 'Denil Castillo' WHERE team = 'Ecuador' AND name = 'Diego Castillo';
UPDATE public.five_a_side_players SET name = 'Nilson Angulo' WHERE team = 'Ecuador' AND name = 'Nelson Angulo';

-- Egypt: trim to 26 (extra reserve removed)
DELETE FROM public.five_a_side_players WHERE team = 'Egypt' AND name = 'Aktay Abdallah';

-- IR Iran: #24 is Dennis Eckert (was stored as Dennis Dargahi)
UPDATE public.five_a_side_players SET name = 'Dennis Eckert' WHERE team = 'IR Iran' AND name = 'Dennis Dargahi';

-- Korea Republic: Cho Yu-min out, Cho Wi-je in (#14)
DELETE FROM public.five_a_side_players WHERE team = 'Korea Republic' AND name = 'Cho Yu-min';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Cho Wi-je', 'Korea Republic', 'df', 14);

-- Netherlands: Jurrien Timber out, Lutsharel Geertruida in (#2)
DELETE FROM public.five_a_side_players WHERE team = 'Netherlands' AND name = 'Jurriën Timber';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Lutsharel Geertruida', 'Netherlands', 'df', 2);

-- Saudi Arabia: Sultan Al-Ghannam out, Sultan Mandash in (#20)
DELETE FROM public.five_a_side_players WHERE team = 'Saudi Arabia' AND name = 'Sultan Al-Ghannam';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Sultan Mandash', 'Saudi Arabia', 'md', 20);

-- Scotland: Billy Gilmour out, Tyler Fletcher in (#8)
DELETE FROM public.five_a_side_players WHERE team = 'Scotland' AND name = 'Billy Gilmour';
INSERT INTO public.five_a_side_players (name, team, position, jersey_number) VALUES
  ('Tyler Fletcher', 'Scotland', 'md', 8);

SELECT public.refresh_five_a_side_player_stats();
