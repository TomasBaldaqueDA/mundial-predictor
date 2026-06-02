-- Iraq 2026 World Cup squad (26: 3 GK, 10 DF, 8 MD, 5 ST). Sky Sports June 2026.

DELETE FROM public.five_a_side_players WHERE team = 'Iraq';

INSERT INTO public.five_a_side_players (name, team, position) VALUES
  ('Fahad Talib', 'Iraq', 'gk'),
  ('Jalal Hassan', 'Iraq', 'gk'),
  ('Ahmed Basil', 'Iraq', 'gk'),
  ('Hussein Ali', 'Iraq', 'df'),
  ('Manaf Younis', 'Iraq', 'df'),
  ('Ahmed Yahya', 'Iraq', 'df'),
  ('Mustafa Saadoon', 'Iraq', 'df'),
  ('Zaid Tahseen', 'Iraq', 'df'),
  ('Rebin Sulaka', 'Iraq', 'df'),
  ('Akam Hashim', 'Iraq', 'df'),
  ('Merchas Doski', 'Iraq', 'df'),
  ('Zaid Ismail', 'Iraq', 'df'),
  ('Frans Putros', 'Iraq', 'df'),
  ('Amir Al-Ammari', 'Iraq', 'md'),
  ('Kevin Yakob', 'Iraq', 'md'),
  ('Zidane Iqbal', 'Iraq', 'md'),
  ('Aimar Sher', 'Iraq', 'md'),
  ('Ibrahim Bayesh', 'Iraq', 'md'),
  ('Ahmed Qasem', 'Iraq', 'md'),
  ('Youssef Amyn', 'Iraq', 'md'),
  ('Marko Farji', 'Iraq', 'md'),
  ('Ali Jassim', 'Iraq', 'st'),
  ('Ali Al-Hamadi', 'Iraq', 'st'),
  ('Ali Yousef', 'Iraq', 'st'),
  ('Aymen Hussein', 'Iraq', 'st'),
  ('Mohanad Ali', 'Iraq', 'st');

SELECT public.refresh_five_a_side_player_stats();
