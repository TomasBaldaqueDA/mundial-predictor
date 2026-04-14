-- Insert 2026 World Cup matches (group + stage metadata)
-- NOTE: kickoff_time is stored as local stadium time without timezone.

insert into public.matches (team1, team2, kickoff_time, status, "group", stage) values
  -- Thursday 11 June 2026
  ('Mexico', 'South Africa', '2026-06-11 20:00:00', 'scheduled', 'A', 'First Stage'),

  -- Friday 12 June 2026
  ('Korea Republic', 'Czechia', '2026-06-12 03:00:00', 'scheduled', 'A', 'First Stage'),
  ('Canada', 'Bosnia and Herzegovina',        '2026-06-12 20:00:00', 'scheduled', 'B', 'First Stage'),

  -- Saturday 13 June 2026
  ('USA',      'Paraguay',  '2026-06-13 02:00:00', 'scheduled', 'D', 'First Stage'),
  ('Qatar',    'Switzerland','2026-06-13 20:00:00', 'scheduled', 'B', 'First Stage'),
  ('Brazil',   'Morocco',   '2026-06-13 23:00:00', 'scheduled', 'C', 'First Stage'),

  -- Sunday 14 June 2026
  ('Haiti',        'Scotland',        '2026-06-14 02:00:00', 'scheduled', 'C', 'First Stage'),
  ('Australia',    'Türkiye', '2026-06-14 05:00:00', 'scheduled', 'D', 'First Stage'),
  ('Germany',      'Curaçao',        '2026-06-14 18:00:00', 'scheduled', 'E', 'First Stage'),
  ('Netherlands',  'Japan',          '2026-06-14 21:00:00', 'scheduled', 'F', 'First Stage'),

  -- Monday 15 June 2026
  ('Côte d''Ivoire', 'Ecuador', '2026-06-15 00:00:00', 'scheduled', 'E', 'First Stage'),
  ('Sweden', 'Tunisia', '2026-06-15 03:00:00', 'scheduled', 'F', 'First Stage'),
  ('Spain',        'Cabo Verde', '2026-06-15 17:00:00', 'scheduled', 'H', 'First Stage'),
  ('Belgium',      'Egypt',      '2026-06-15 20:00:00', 'scheduled', 'G', 'First Stage'),
  ('Saudi Arabia', 'Uruguay',    '2026-06-15 23:00:00', 'scheduled', 'H', 'First Stage'),

  -- Tuesday 16 June 2026
  ('IR Iran',     'New Zealand', '2026-06-16 02:00:00', 'scheduled', 'G', 'First Stage'),
  ('France',      'Senegal',     '2026-06-16 20:00:00', 'scheduled', 'I', 'First Stage'),
  ('Iraq', 'Norway',      '2026-06-16 23:00:00', 'scheduled', 'I', 'First Stage'),

  -- Wednesday 17 June 2026
  ('Argentina', 'Algeria', '2026-06-17 02:00:00', 'scheduled', 'J', 'First Stage'),
  ('Austria',   'Jordan',  '2026-06-17 05:00:00', 'scheduled', 'J', 'First Stage'),
  ('Portugal',  'Congo DR', '2026-06-17 18:00:00', 'scheduled', 'K', 'First Stage'),
  ('England',   'Croatia',     '2026-06-17 21:00:00', 'scheduled', 'L', 'First Stage'),

  -- Thursday 18 June 2026
  ('Ghana',      'Panama',    '2026-06-18 00:00:00', 'scheduled', 'L', 'First Stage'),
  ('Uzbekistan', 'Colombia',  '2026-06-18 03:00:00', 'scheduled', 'K', 'First Stage'),
  ('Czechia', 'South Africa', '2026-06-18 17:00:00', 'scheduled', 'A', 'First Stage'),
  ('Switzerland',     'Bosnia and Herzegovina', '2026-06-18 20:00:00', 'scheduled', 'B', 'First Stage'),
  ('Canada',          'Qatar',           '2026-06-18 23:00:00', 'scheduled', 'B', 'First Stage'),

  -- Friday 19 June 2026
  ('Mexico', 'Korea Republic', '2026-06-19 02:00:00', 'scheduled', 'A', 'First Stage'),
  ('USA',    'Australia',      '2026-06-19 20:00:00', 'scheduled', 'D', 'First Stage'),
  ('Scotland','Morocco',       '2026-06-19 23:00:00', 'scheduled', 'C', 'First Stage'),

  -- Saturday 20 June 2026
  ('Brazil',          'Haiti',        '2026-06-20 02:00:00', 'scheduled', 'C', 'First Stage'),
  ('Türkiye', 'Paraguay',     '2026-06-20 05:00:00', 'scheduled', 'D', 'First Stage'),
  ('Netherlands',     'Sweden', '2026-06-20 18:00:00', 'scheduled', 'F', 'First Stage'),
  ('Germany',         'Côte d''Ivoire',  '2026-06-20 21:00:00', 'scheduled', 'E', 'First Stage'),

  -- Sunday 21 June 2026
  ('Ecuador', 'Curaçao',     '2026-06-21 01:00:00', 'scheduled', 'E', 'First Stage'),
  ('Tunisia', 'Japan',       '2026-06-21 05:00:00', 'scheduled', 'F', 'First Stage'),
  ('Spain',   'Saudi Arabia','2026-06-21 17:00:00', 'scheduled', 'H', 'First Stage'),
  ('Belgium', 'IR Iran',     '2026-06-21 20:00:00', 'scheduled', 'G', 'First Stage'),
  ('Uruguay', 'Cabo Verde',  '2026-06-21 23:00:00', 'scheduled', 'H', 'First Stage'),

  -- Monday 22 June 2026
  ('New Zealand', 'Egypt',    '2026-06-22 02:00:00', 'scheduled', 'G', 'First Stage'),
  ('Argentina',   'Austria',  '2026-06-22 18:00:00', 'scheduled', 'J', 'First Stage'),
  ('France',      'Iraq', '2026-06-22 22:00:00', 'scheduled', 'I', 'First Stage'),

  -- Tuesday 23 June 2026
  ('Norway',  'Senegal', '2026-06-23 01:00:00', 'scheduled', 'I', 'First Stage'),
  ('Jordan',  'Algeria', '2026-06-23 04:00:00', 'scheduled', 'J', 'First Stage'),
  ('Portugal','Uzbekistan', '2026-06-23 18:00:00', 'scheduled', 'K', 'First Stage'),
  ('England', 'Ghana',      '2026-06-23 21:00:00', 'scheduled', 'L', 'First Stage'),

  -- Wednesday 24 June 2026
  ('Panama',   'Croatia',      '2026-06-24 00:00:00', 'scheduled', 'L', 'First Stage'),
  ('Colombia', 'Congo DR',  '2026-06-24 03:00:00', 'scheduled', 'K', 'First Stage'),
  ('Switzerland', 'Canada',    '2026-06-24 20:00:00', 'scheduled', 'B', 'First Stage'),
  ('Bosnia and Herzegovina', 'Qatar', '2026-06-24 20:00:00', 'scheduled', 'B', 'First Stage'),
  ('Scotland', 'Brazil',       '2026-06-24 23:00:00', 'scheduled', 'C', 'First Stage'),
  ('Morocco',  'Haiti',        '2026-06-24 23:00:00', 'scheduled', 'C', 'First Stage'),

  -- Thursday 25 June 2026
  ('Czechia', 'Mexico',        '2026-06-25 02:00:00', 'scheduled', 'A', 'First Stage'),
  ('South Africa',     'Korea Republic','2026-06-25 02:00:00', 'scheduled', 'A', 'First Stage'),
  ('Curaçao',          'Côte d''Ivoire','2026-06-25 21:00:00', 'scheduled', 'E', 'First Stage'),
  ('Ecuador',          'Germany',       '2026-06-25 21:00:00', 'scheduled', 'E', 'First Stage'),

  -- Friday 26 June 2026
  ('Japan',     'Sweden', '2026-06-26 00:00:00', 'scheduled', 'F', 'First Stage'),
  ('Tunisia',   'Netherlands',     '2026-06-26 00:00:00', 'scheduled', 'F', 'First Stage'),
  ('Türkiye', 'USA',       '2026-06-26 03:00:00', 'scheduled', 'D', 'First Stage'),
  ('Paraguay',  'Australia',       '2026-06-26 03:00:00', 'scheduled', 'D', 'First Stage'),
  ('Norway',    'France',          '2026-06-26 20:00:00', 'scheduled', 'I', 'First Stage'),
  ('Senegal',   'Iraq',     '2026-06-26 20:00:00', 'scheduled', 'I', 'First Stage'),

  -- Saturday 27 June 2026
  ('Cabo Verde', 'Saudi Arabia', '2026-06-27 01:00:00', 'scheduled', 'H', 'First Stage'),
  ('Uruguay',    'Spain',        '2026-06-27 01:00:00', 'scheduled', 'H', 'First Stage'),
  ('Egypt',      'IR Iran',      '2026-06-27 04:00:00', 'scheduled', 'G', 'First Stage'),
  ('New Zealand','Belgium',      '2026-06-27 04:00:00', 'scheduled', 'G', 'First Stage'),
  ('Panama',     'England',      '2026-06-27 22:00:00', 'scheduled', 'L', 'First Stage'),
  ('Croatia',    'Ghana',        '2026-06-27 22:00:00', 'scheduled', 'L', 'First Stage'),

  -- Sunday 28 June 2026
  ('Colombia',    'Portugal',   '2026-06-28 00:30:00', 'scheduled', 'K', 'First Stage'),
  ('Congo DR', 'Uzbekistan', '2026-06-28 00:30:00', 'scheduled', 'K', 'First Stage'),
  ('Algeria',     'Austria',    '2026-06-28 03:00:00', 'scheduled', 'J', 'First Stage'),
  ('Jordan',      'Argentina',  '2026-06-28 03:00:00', 'scheduled', 'J', 'First Stage'),

  -- Knockout stage (no group)
  -- Round of 32
  ('2A',       '2B',       '2026-06-28 20:00:00', 'scheduled', null, 'Round of 32'),
  ('1C',       '2F',       '2026-06-29 18:00:00', 'scheduled', null, 'Round of 32'),
  ('1E',       '3ABCDF',   '2026-06-29 21:30:00', 'scheduled', null, 'Round of 32'),
  ('1F',       '2C',       '2026-06-30 02:00:00', 'scheduled', null, 'Round of 32'),
  ('2E',       '2I',       '2026-06-30 18:00:00', 'scheduled', null, 'Round of 32'),
  ('1I',       '3CDFGH',   '2026-06-30 22:00:00', 'scheduled', null, 'Round of 32'),
  ('1A',       '3CEFHI',   '2026-07-01 02:00:00', 'scheduled', null, 'Round of 32'),
  ('1L',       '3EHIJK',   '2026-07-01 17:00:00', 'scheduled', null, 'Round of 32'),
  ('1G',       '3AEHIJ',   '2026-07-01 21:00:00', 'scheduled', null, 'Round of 32'),
  ('1D',       '3BEFIJ',   '2026-07-02 01:00:00', 'scheduled', null, 'Round of 32'),
  ('1H',       '2J',       '2026-07-02 20:00:00', 'scheduled', null, 'Round of 32'),
  ('2K',       '2L',       '2026-07-03 00:00:00', 'scheduled', null, 'Round of 32'),
  ('1B',       '3EFGIJ',   '2026-07-03 04:00:00', 'scheduled', null, 'Round of 32'),
  ('2D',       '2G',       '2026-07-03 19:00:00', 'scheduled', null, 'Round of 32'),
  ('1J',       '2H',       '2026-07-03 23:00:00', 'scheduled', null, 'Round of 32'),
  ('1K',       '3DEIJL',   '2026-07-04 02:30:00', 'scheduled', null, 'Round of 32'),

  -- Round of 16
  ('W73', 'W75', '2026-07-04 18:00:00', 'scheduled', null, 'Round of 16'),
  ('W74', 'W77', '2026-07-04 22:00:00', 'scheduled', null, 'Round of 16'),
  ('W76', 'W78', '2026-07-05 21:00:00', 'scheduled', null, 'Round of 16'),
  ('W79', 'W80', '2026-07-06 01:00:00', 'scheduled', null, 'Round of 16'),
  ('W83', 'W84', '2026-07-06 20:00:00', 'scheduled', null, 'Round of 16'),
  ('W81', 'W82', '2026-07-07 01:00:00', 'scheduled', null, 'Round of 16'),
  ('W86', 'W88', '2026-07-07 17:00:00', 'scheduled', null, 'Round of 16'),
  ('W85', 'W87', '2026-07-07 21:00:00', 'scheduled', null, 'Round of 16'),

  -- Quarter-finals
  ('W89', 'W90', '2026-07-09 21:00:00', 'scheduled', null, 'Quarter-final'),
  ('W93', 'W94', '2026-07-10 20:00:00', 'scheduled', null, 'Quarter-final'),
  ('W91', 'W92', '2026-07-11 22:00:00', 'scheduled', null, 'Quarter-final'),
  ('W95', 'W96', '2026-07-12 02:00:00', 'scheduled', null, 'Quarter-final'),

  -- Semi-finals
  ('W97', 'W98', '2026-07-14 20:00:00', 'scheduled', null, 'Semi-final'),
  ('W99', 'W100','2026-07-15 20:00:00', 'scheduled', null, 'Semi-final'),

  -- Third place
  ('RU101', 'RU102', '2026-07-18 22:00:00', 'scheduled', null, 'Play-off for third place'),

  -- Final
  ('W101', 'W102', '2026-07-19 20:00:00', 'scheduled', null, 'Final');

