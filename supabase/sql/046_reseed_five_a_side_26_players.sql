-- Reseed 5-A-SIDE squad: 26 players per nation (3 GK, 8 DF, 8 MD, 7 ST).
-- Used by MVP / "melhor em campo" dropdowns (names must match matches.mvp when set).
--
-- WARNING: DELETE clears all rows; five_a_side_picks player FKs ON DELETE SET NULL
-- (users lose chosen players until they pick again). Run only before go-live or in dev.
-- Prerequisites: 029, 033 (stats columns), 045 (photo_url optional — column may be absent on older DBs;
-- if 045 not applied yet, run 045 first or omit photo_url from any manual INSERTs).
--
-- After apply: refresh fantasy stats from existing finished matches.
DELETE FROM public.five_a_side_players;

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
gk AS (
  SELECT t.team, 'gk'::text AS position, u.n
  FROM teams t
  CROSS JOIN unnest(ARRAY[1, 2, 3]) AS u(n)
),
df AS (
  SELECT t.team, 'df'::text AS position, u.n
  FROM teams t
  CROSS JOIN unnest(ARRAY[1, 2, 3, 4, 5, 6, 7, 8]) AS u(n)
),
md AS (
  SELECT t.team, 'md'::text AS position, u.n
  FROM teams t
  CROSS JOIN unnest(ARRAY[1, 2, 3, 4, 5, 6, 7, 8]) AS u(n)
),
st AS (
  SELECT t.team, 'st'::text AS position, u.n
  FROM teams t
  CROSS JOIN unnest(ARRAY[1, 2, 3, 4, 5, 6, 7]) AS u(n)
),
slots AS (
  SELECT * FROM gk
  UNION ALL SELECT * FROM df
  UNION ALL SELECT * FROM md
  UNION ALL SELECT * FROM st
)
INSERT INTO public.five_a_side_players (name, team, position)
SELECT team || ' ' || upper(position) || ' ' || n::text, team, position
FROM slots;

-- Sync MVP / wins / clean sheets from matches (no-op if no finished matches).
SELECT public.refresh_five_a_side_player_stats();
