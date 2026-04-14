-- Replace placeholder national teams with 2026 draw qualifiers.
-- Run once on existing DB: inserts new group_teams rows, repoints children, removes old keys.

BEGIN;

-- A: DEN/MKD/CZE/IRL -> Czechia
INSERT INTO public.group_teams (group_code, team_name) VALUES ('A', 'Czechia') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Czechia' WHERE group_code = 'A' AND team_name = 'DEN/MKD/CZE/IRL';
UPDATE public.group_actual_standings SET team_name = 'Czechia' WHERE group_code = 'A' AND team_name = 'DEN/MKD/CZE/IRL';
UPDATE public.matches SET team1 = 'Czechia' WHERE team1 = 'DEN/MKD/CZE/IRL';
UPDATE public.matches SET team2 = 'Czechia' WHERE team2 = 'DEN/MKD/CZE/IRL';
UPDATE public.predictions SET pred_qualifier = 'Czechia' WHERE pred_qualifier = 'DEN/MKD/CZE/IRL';
UPDATE public.five_a_side_players SET team = 'Czechia', name = REPLACE(name, 'DEN/MKD/CZE/IRL', 'Czechia') WHERE team = 'DEN/MKD/CZE/IRL';
UPDATE public.special_answers SET answer = 'Czechia' WHERE answer = 'DEN/MKD/CZE/IRL';
UPDATE public.special_questions SET correct_answer = 'Czechia' WHERE correct_answer = 'DEN/MKD/CZE/IRL';
UPDATE public.matches SET mvp = REPLACE(mvp, 'DEN/MKD/CZE/IRL', 'Czechia') WHERE mvp IS NOT NULL AND mvp LIKE '%DEN/MKD/CZE/IRL%';
DELETE FROM public.group_teams WHERE group_code = 'A' AND team_name = 'DEN/MKD/CZE/IRL';

-- B: ITA/NIR/WAL/BIH -> Bosnia and Herzegovina
INSERT INTO public.group_teams (group_code, team_name) VALUES ('B', 'Bosnia and Herzegovina') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Bosnia and Herzegovina' WHERE group_code = 'B' AND team_name = 'ITA/NIR/WAL/BIH';
UPDATE public.group_actual_standings SET team_name = 'Bosnia and Herzegovina' WHERE group_code = 'B' AND team_name = 'ITA/NIR/WAL/BIH';
UPDATE public.matches SET team1 = 'Bosnia and Herzegovina' WHERE team1 = 'ITA/NIR/WAL/BIH';
UPDATE public.matches SET team2 = 'Bosnia and Herzegovina' WHERE team2 = 'ITA/NIR/WAL/BIH';
UPDATE public.predictions SET pred_qualifier = 'Bosnia and Herzegovina' WHERE pred_qualifier = 'ITA/NIR/WAL/BIH';
UPDATE public.five_a_side_players SET team = 'Bosnia and Herzegovina', name = REPLACE(name, 'ITA/NIR/WAL/BIH', 'Bosnia and Herzegovina') WHERE team = 'ITA/NIR/WAL/BIH';
UPDATE public.special_answers SET answer = 'Bosnia and Herzegovina' WHERE answer = 'ITA/NIR/WAL/BIH';
UPDATE public.special_questions SET correct_answer = 'Bosnia and Herzegovina' WHERE correct_answer = 'ITA/NIR/WAL/BIH';
UPDATE public.matches SET mvp = REPLACE(mvp, 'ITA/NIR/WAL/BIH', 'Bosnia and Herzegovina') WHERE mvp IS NOT NULL AND mvp LIKE '%ITA/NIR/WAL/BIH%';
DELETE FROM public.group_teams WHERE group_code = 'B' AND team_name = 'ITA/NIR/WAL/BIH';

-- D: TUR/ROU/SVK/KOS -> Türkiye
INSERT INTO public.group_teams (group_code, team_name) VALUES ('D', 'Türkiye') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Türkiye' WHERE group_code = 'D' AND team_name = 'TUR/ROU/SVK/KOS';
UPDATE public.group_actual_standings SET team_name = 'Türkiye' WHERE group_code = 'D' AND team_name = 'TUR/ROU/SVK/KOS';
UPDATE public.matches SET team1 = 'Türkiye' WHERE team1 = 'TUR/ROU/SVK/KOS';
UPDATE public.matches SET team2 = 'Türkiye' WHERE team2 = 'TUR/ROU/SVK/KOS';
UPDATE public.predictions SET pred_qualifier = 'Türkiye' WHERE pred_qualifier = 'TUR/ROU/SVK/KOS';
UPDATE public.five_a_side_players SET team = 'Türkiye', name = REPLACE(name, 'TUR/ROU/SVK/KOS', 'Türkiye') WHERE team = 'TUR/ROU/SVK/KOS';
UPDATE public.special_answers SET answer = 'Türkiye' WHERE answer = 'TUR/ROU/SVK/KOS';
UPDATE public.special_questions SET correct_answer = 'Türkiye' WHERE correct_answer = 'TUR/ROU/SVK/KOS';
UPDATE public.matches SET mvp = REPLACE(mvp, 'TUR/ROU/SVK/KOS', 'Türkiye') WHERE mvp IS NOT NULL AND mvp LIKE '%TUR/ROU/SVK/KOS%';
DELETE FROM public.group_teams WHERE group_code = 'D' AND team_name = 'TUR/ROU/SVK/KOS';

-- F: UKR/SWE/POL/ALB -> Sweden
INSERT INTO public.group_teams (group_code, team_name) VALUES ('F', 'Sweden') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Sweden' WHERE group_code = 'F' AND team_name = 'UKR/SWE/POL/ALB';
UPDATE public.group_actual_standings SET team_name = 'Sweden' WHERE group_code = 'F' AND team_name = 'UKR/SWE/POL/ALB';
UPDATE public.matches SET team1 = 'Sweden' WHERE team1 = 'UKR/SWE/POL/ALB';
UPDATE public.matches SET team2 = 'Sweden' WHERE team2 = 'UKR/SWE/POL/ALB';
UPDATE public.predictions SET pred_qualifier = 'Sweden' WHERE pred_qualifier = 'UKR/SWE/POL/ALB';
UPDATE public.five_a_side_players SET team = 'Sweden', name = REPLACE(name, 'UKR/SWE/POL/ALB', 'Sweden') WHERE team = 'UKR/SWE/POL/ALB';
UPDATE public.special_answers SET answer = 'Sweden' WHERE answer = 'UKR/SWE/POL/ALB';
UPDATE public.special_questions SET correct_answer = 'Sweden' WHERE correct_answer = 'UKR/SWE/POL/ALB';
UPDATE public.matches SET mvp = REPLACE(mvp, 'UKR/SWE/POL/ALB', 'Sweden') WHERE mvp IS NOT NULL AND mvp LIKE '%UKR/SWE/POL/ALB%';
DELETE FROM public.group_teams WHERE group_code = 'F' AND team_name = 'UKR/SWE/POL/ALB';

-- I: BOL/SUR/IRQ -> Iraq
INSERT INTO public.group_teams (group_code, team_name) VALUES ('I', 'Iraq') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Iraq' WHERE group_code = 'I' AND team_name = 'BOL/SUR/IRQ';
UPDATE public.group_actual_standings SET team_name = 'Iraq' WHERE group_code = 'I' AND team_name = 'BOL/SUR/IRQ';
UPDATE public.matches SET team1 = 'Iraq' WHERE team1 = 'BOL/SUR/IRQ';
UPDATE public.matches SET team2 = 'Iraq' WHERE team2 = 'BOL/SUR/IRQ';
UPDATE public.predictions SET pred_qualifier = 'Iraq' WHERE pred_qualifier = 'BOL/SUR/IRQ';
UPDATE public.five_a_side_players SET team = 'Iraq', name = REPLACE(name, 'BOL/SUR/IRQ', 'Iraq') WHERE team = 'BOL/SUR/IRQ';
UPDATE public.special_answers SET answer = 'Iraq' WHERE answer = 'BOL/SUR/IRQ';
UPDATE public.special_questions SET correct_answer = 'Iraq' WHERE correct_answer = 'BOL/SUR/IRQ';
UPDATE public.matches SET mvp = REPLACE(mvp, 'BOL/SUR/IRQ', 'Iraq') WHERE mvp IS NOT NULL AND mvp LIKE '%BOL/SUR/IRQ%';
DELETE FROM public.group_teams WHERE group_code = 'I' AND team_name = 'BOL/SUR/IRQ';

-- K: NCL/JAM/COD -> Congo DR
INSERT INTO public.group_teams (group_code, team_name) VALUES ('K', 'Congo DR') ON CONFLICT (group_code, team_name) DO NOTHING;
UPDATE public.group_predictions SET team_name = 'Congo DR' WHERE group_code = 'K' AND team_name = 'NCL/JAM/COD';
UPDATE public.group_actual_standings SET team_name = 'Congo DR' WHERE group_code = 'K' AND team_name = 'NCL/JAM/COD';
UPDATE public.matches SET team1 = 'Congo DR' WHERE team1 = 'NCL/JAM/COD';
UPDATE public.matches SET team2 = 'Congo DR' WHERE team2 = 'NCL/JAM/COD';
UPDATE public.predictions SET pred_qualifier = 'Congo DR' WHERE pred_qualifier = 'NCL/JAM/COD';
UPDATE public.five_a_side_players SET team = 'Congo DR', name = REPLACE(name, 'NCL/JAM/COD', 'Congo DR') WHERE team = 'NCL/JAM/COD';
UPDATE public.special_answers SET answer = 'Congo DR' WHERE answer = 'NCL/JAM/COD';
UPDATE public.special_questions SET correct_answer = 'Congo DR' WHERE correct_answer = 'NCL/JAM/COD';
UPDATE public.matches SET mvp = REPLACE(mvp, 'NCL/JAM/COD', 'Congo DR') WHERE mvp IS NOT NULL AND mvp LIKE '%NCL/JAM/COD%';
DELETE FROM public.group_teams WHERE group_code = 'K' AND team_name = 'NCL/JAM/COD';

COMMIT;
