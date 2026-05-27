-- South Africa 2026 World Cup squad (26: 3 GK, 11 DF, 4 MD, 8 ST). May 2026.

DELETE FROM public.five_a_side_players WHERE team = 'South Africa';

INSERT INTO public.five_a_side_players (name, team, position, photo_url) VALUES
  ('Ronwen Williams', 'South Africa', 'gk', '/imgs_cartoons/South%20Africa/Ronwen%20Williams.jpg'),
  ('Ricardo Goss', 'South Africa', 'gk', NULL),
  ('Sipho Chaine', 'South Africa', 'gk', NULL),
  ('Khuliso Mudau', 'South Africa', 'df', NULL),
  ('Aubrey Modiba', 'South Africa', 'df', '/imgs_cartoons/South%20Africa/Aubrey%20Modiba.jpg'),
  ('Khulumani Ndamane', 'South Africa', 'df', NULL),
  ('Olwethu Makhanya', 'South Africa', 'df', NULL),
  ('Bradley Cross', 'South Africa', 'df', NULL),
  ('Thabang Matuludi', 'South Africa', 'df', NULL),
  ('Nkosinathi Sibisi', 'South Africa', 'df', '/imgs_cartoons/South%20Africa/Nkosinathi%20Sibisi.jpg'),
  ('Kamogelo Sebelebele', 'South Africa', 'df', NULL),
  ('Ime Okon', 'South Africa', 'df', NULL),
  ('Samukele Kabini', 'South Africa', 'df', NULL),
  ('Mbekezeli Mbokazi', 'South Africa', 'df', '/imgs_cartoons/South%20Africa/Mbekezeli%20Mbokazi.jpg'),
  ('Teboho Mokoena', 'South Africa', 'md', '/imgs_cartoons/South%20Africa/Teboho%20Mokoena.jpg'),
  ('Jayden Adams', 'South Africa', 'md', '/imgs_cartoons/South%20Africa/Jayden%20Adams.jpg'),
  ('Thalente Mbatha', 'South Africa', 'md', '/imgs_cartoons/South%20Africa/Thalente%20Mbatha.jpg'),
  ('Sphephelo Sithole', 'South Africa', 'md', NULL),
  ('Oswin Appollis', 'South Africa', 'st', '/imgs_cartoons/South%20Africa/Oswin%20Appollis.jpg'),
  ('Tshepang Moremi', 'South Africa', 'st', NULL),
  ('Evidence Makgopa', 'South Africa', 'st', NULL),
  ('Relebohile Mofokeng', 'South Africa', 'st', '/imgs_cartoons/South%20Africa/Relebohile%20Mofokeng.jpg'),
  ('Lyle Foster', 'South Africa', 'st', '/imgs_cartoons/South%20Africa/Lyle%20Foster.jpg'),
  ('Iqraam Rayners', 'South Africa', 'st', NULL),
  ('Themba Zwane', 'South Africa', 'st', NULL),
  ('Thapelo Maseko', 'South Africa', 'st', NULL);

SELECT public.refresh_five_a_side_player_stats();
