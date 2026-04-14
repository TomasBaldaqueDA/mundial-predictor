-- Seed 5-A-SIDE players: 2 GK, 3 DF, 4 MD, 3 ST per team (48 teams from TEAMS_BY_GROUP).
-- Run after 029_five_a_side_players.sql.

WITH teams(team) AS (
  VALUES
    ('Mexico'), ('South Africa'), ('Korea Republic'), ('Czechia'),
    ('Canada'), ('Bosnia and Herzegovina'), ('Qatar'), ('Switzerland'),
    ('Brazil'), ('Morocco'), ('Haiti'), ('Scotland'),
    ('USA'), ('Paraguay'), ('Australia'), ('Türkiye'),
    ('Germany'), ('Curaçao'), ('Côte d''Ivoire'), ('Ecuador'),
    ('Netherlands'), ('Japan'), ('Sweden'), ('Tunisia'),
    ('Belgium'), ('Egypt'), ('IR Iran'), ('New Zealand'),
    ('Spain'), ('Cabo Verde'), ('Saudi Arabia'), ('Uruguay'),
    ('France'), ('Senegal'), ('Iraq'), ('Norway'),
    ('Argentina'), ('Algeria'), ('Austria'), ('Jordan'),
    ('Portugal'), ('Congo DR'), ('Uzbekistan'), ('Colombia'),
    ('England'), ('Croatia'), ('Ghana'), ('Panama')
),
slots AS (
  SELECT team, 'gk' AS position, 1 AS n FROM teams UNION ALL SELECT team, 'gk', 2 FROM teams
  UNION ALL SELECT team, 'df', 1 FROM teams UNION ALL SELECT team, 'df', 2 FROM teams UNION ALL SELECT team, 'df', 3 FROM teams
  UNION ALL SELECT team, 'md', 1 FROM teams UNION ALL SELECT team, 'md', 2 FROM teams UNION ALL SELECT team, 'md', 3 FROM teams UNION ALL SELECT team, 'md', 4 FROM teams
  UNION ALL SELECT team, 'st', 1 FROM teams UNION ALL SELECT team, 'st', 2 FROM teams UNION ALL SELECT team, 'st', 3 FROM teams
)
INSERT INTO public.five_a_side_players (name, team, position)
SELECT team || ' ' || UPPER(position) || ' ' || n, team, position
FROM slots;