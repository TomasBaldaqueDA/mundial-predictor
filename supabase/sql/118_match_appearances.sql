-- Track which squad players actually played (starters + subs) per match.
-- Wins, clean sheets and GP are derived from appearances — not the full 26-man squad.
--
-- Production: apply this migration, then run:
--   QA_TLS_INSECURE=1 node scripts/recalc-stats-from-appearances.mjs
-- (uses data/match-appearances.json for all finished matches; keeps goals/assists unchanged)

CREATE TABLE IF NOT EXISTS public.match_appearances (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  match_id bigint NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.five_a_side_players(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_match_appearances_player ON public.match_appearances (player_id);
CREATE INDEX IF NOT EXISTS idx_match_appearances_match ON public.match_appearances (match_id);

ALTER TABLE public.match_appearances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read match appearances" ON public.match_appearances;
CREATE POLICY "Anyone can read match appearances"
  ON public.match_appearances FOR SELECT
  USING (true);

ALTER TABLE public.five_a_side_players
  ADD COLUMN IF NOT EXISTS games_played int NOT NULL DEFAULT 0;

COMMENT ON TABLE public.match_appearances IS
  'Players who appeared in a finished match (XI + substitutes). Drives GP / wins / clean sheets.';
COMMENT ON COLUMN public.five_a_side_players.games_played IS
  'World Cup matches this player appeared in (starters or subs).';

CREATE OR REPLACE FUNCTION public.refresh_five_a_side_player_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.five_a_side_players p
  SET games_played = COALESCE(
    (SELECT COUNT(*)::int
     FROM public.match_appearances ma
     INNER JOIN public.matches m ON m.id = ma.match_id
     WHERE ma.player_id = p.id
       AND m.status = 'finished'),
    0
  )
  WHERE TRUE;

  UPDATE public.five_a_side_players p
  SET mvp = COALESCE(
    (SELECT COUNT(*)::int
     FROM public.matches m
     INNER JOIN public.match_appearances ma ON ma.match_id = m.id AND ma.player_id = p.id
     WHERE m.status = 'finished'
       AND m.mvp IS NOT NULL AND m.mvp <> ''
       AND trim(lower(m.mvp)) = trim(lower(p.name))),
    0
  )
  WHERE TRUE;

  UPDATE public.five_a_side_players p
  SET wins = COALESCE(
    (SELECT COUNT(*)::int
     FROM public.matches m
     INNER JOIN public.match_appearances ma ON ma.match_id = m.id AND ma.player_id = p.id
     WHERE m.status = 'finished'
       AND m.score1 IS NOT NULL AND m.score2 IS NOT NULL
       AND ((m.team1 = p.team AND m.score1 > m.score2)
         OR (m.team2 = p.team AND m.score2 > m.score1))),
    0
  )
  WHERE TRUE;

  UPDATE public.five_a_side_players p
  SET clean_sheets = CASE
    WHEN p.position NOT IN ('gk', 'df') THEN 0
    ELSE COALESCE(
      (SELECT COUNT(*)::int
       FROM public.matches m
       INNER JOIN public.match_appearances ma ON ma.match_id = m.id AND ma.player_id = p.id
       WHERE m.status = 'finished'
         AND m.score1 IS NOT NULL AND m.score2 IS NOT NULL
         AND ((m.team1 = p.team AND m.score2 = 0)
           OR (m.team2 = p.team AND m.score1 = 0))),
      0
    )
  END
  WHERE TRUE;
END;
$$;

-- Helper: insert appearances by (match_id, team, player names[])
CREATE OR REPLACE FUNCTION public.add_match_appearances(
  p_match_id bigint,
  p_team text,
  p_names text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.match_appearances (match_id, player_id)
  SELECT p_match_id, p.id
  FROM public.five_a_side_players p
  WHERE p.team = p_team
    AND p.name = ANY (p_names)
  ON CONFLICT (match_id, player_id) DO NOTHING;
END;
$$;

-- ── Match 1: Mexico 2-0 South Africa (Sky Sports lineups) ──
SELECT public.add_match_appearances(1, 'Mexico', ARRAY[
  'Raul Rangel', 'Israel Reyes', 'Cesar Montes', 'Johan Vasquez', 'Jesus Gallardo',
  'Erik Lira', 'Roberto Alvarado', 'Brian Gutierrez', 'Alvaro Fidalgo', 'Julian Quinones', 'Raul Jimenez',
  'Gilberto Mora', 'Mateo Chavez', 'Luis Chavez', 'Edson Alvarez', 'Luis Romo', 'Armando Gonzalez', 'Alexis Vega'
]);

SELECT public.add_match_appearances(1, 'South Africa', ARRAY[
  'Ronwen Williams', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Ime Okon', 'Mbekezeli Mbokazi', 'Aubrey Modiba',
  'Teboho Mokoena', 'Sphephelo Sithole', 'Jayden Adams', 'Iqraam Rayners', 'Lyle Foster',
  'Thalente Mbatha', 'Themba Zwane', 'Oswin Appollis', 'Evidence Makgopa'
]);

-- ── Match 2: Korea Republic 2-1 Czechia (FIFA lineups + bench unused lists) ──
SELECT public.add_match_appearances(2, 'Korea Republic', ARRAY[
  'Kim Seung-gyu', 'Lee Han-beom', 'Park Jin-seob', 'Lee Ki-hyuk', 'Kim Min-jae', 'Lee Tae-seok', 'Seol Young-woo',
  'Hwang Hee-chan', 'Yang Hyun-jun', 'Hwang In-beom', 'Lee Jae-sung', 'Kim Jin-gyu', 'Eom Ji-sung', 'Lee Kan-gin',
  'Paik Seung-ho', 'Cho Gue-sung', 'Son Heung-min', 'Oh Hyeong-yu'
]);

SELECT public.add_match_appearances(2, 'Czechia', ARRAY[
  'Matej Kovar', 'Vladimir Coufal', 'Robin Hranac', 'Stepan Chaloupek', 'Ladislav Krejci', 'Jaroslav Zeleny',
  'Vladimir Darida', 'Lukas Provod', 'Michal Sadilek', 'Alexandr Sojka', 'Tomas Soucek', 'Pavel Sulc',
  'Adam Hlozek', 'Tomas Chory', 'Mojmir Chytil', 'Jan Kuchta', 'Patrik Schick'
]);

-- ── Match 3: Canada 1-1 Bosnia and Herzegovina (Sofascore lineups) ──
SELECT public.add_match_appearances(3, 'Canada', ARRAY[
  'Maxime Crepeau', 'Richie Laryea', 'Derek Cornelius', 'Luc de Fougerolles', 'Alistair Johnston',
  'Liam Millar', 'Stephen Eustaquio', 'Ismael Kone', 'Tajon Buchanan', 'Tani Oluwaseyi', 'Jonathan David',
  'Ali Ahmed', 'Jacob Shaffelburg', 'Promise David', 'Cyle Larin', 'Jonathan Osorio'
]);

SELECT public.add_match_appearances(3, 'Bosnia and Herzegovina', ARRAY[
  'Nikola Vasilj', 'Amar Dedić', 'Nikola Katić', 'Tarik Muharemović', 'Sead Kolašinac',
  'Esmir Bajraktarevic', 'Benjamin Tahirovic', 'Ivan Basic', 'Amar Memic', 'Ermedin Demirovic', 'Jovo Lukic',
  'Armin Gigovic', 'Samed Bazdar', 'Ivan Sunjic', 'Kerim Alajbegovic', 'Dzenis Burnic'
]);

-- ── Match 4: USA 4-1 Paraguay (Sofascore lineups) ──
SELECT public.add_match_appearances(4, 'USA', ARRAY[
  'Matt Freese', 'Antonee Robinson', 'Tim Ream', 'Chris Richards', 'Alex Freeman',
  'Malik Tillman', 'Tyler Adams', 'Christian Pulisic', 'Weston McKennie', 'Sergiño Dest', 'Folarin Balogun',
  'Sebastian Berhalter', 'Timothy Weah', 'Ricardo Pepi', 'Gio Reyna'
]);

SELECT public.add_match_appearances(4, 'Paraguay', ARRAY[
  'Orlando Gill', 'Diego Gomez', 'Andres Cubas', 'Damian Bobadilla', 'Miguel Almiron',
  'Juan Jose Caceres', 'Gustavo Gomez', 'Omar Alderete', 'Junior Alonso', 'Antonio Sanabria', 'Julio Enciso',
  'Mauricio Magalhaes', 'Alex Arce', 'Gustavo Velazquez', 'Ramon Sosa', 'Alejandro Romero'
]);

-- ── Match 5: Qatar 1-1 Switzerland (Sofascore lineups) ──
SELECT public.add_match_appearances(5, 'Qatar', ARRAY[
  'Mahmoud Abunada', 'Homam Al-Amin', 'Boualem Khoukhi', 'Pedro Miguel', 'Ayoub Alawi',
  'Issa Laaye', 'Assim Madibo', 'Jassem Jaber', 'Akram Afif', 'Youssef Abdulrazzaq', 'Edmilson Junior',
  'Ahmed Fathi', 'Karim Boudiaf', 'Ahmed Alaa', 'Mohammed Al-Manai', 'Hassan Al-Haydos'
]);

SELECT public.add_match_appearances(5, 'Switzerland', ARRAY[
  'Gregor Kobel', 'Denis Zakaria', 'Nico Elvedi', 'Manuel Akanji', 'Ricardo Rodriguez',
  'Michel Aebischer', 'Granit Xhaka', 'Remo Freuler', 'Dan Ndoye', 'Breel Embolo', 'Ruben Vargas',
  'Fabian Rieder', 'Johan Manzambi', 'Zeki Amdouni', 'Miro Muheim', 'Ardon Jashari'
]);

-- ── Match 6: Brazil 1-1 Morocco (Sofascore lineups) ──
SELECT public.add_match_appearances(6, 'Brazil', ARRAY[
  'Alisson', 'Douglas Santos', 'Gabriel Magalhaes', 'Marquinhos', 'Ibanez',
  'Bruno Guimaraes', 'Casemiro', 'Vinicius Jr', 'Raphinha', 'Lucas Paqueta', 'Igor Thiago',
  'Danilo', 'Fabinho', 'Matheus Cunha', 'Luiz Henrique', 'Danilo Santos'
]);

SELECT public.add_match_appearances(6, 'Morocco', ARRAY[
  'Yassine Bounou', 'Achraf Hakimi', 'Issa Diop', 'Chadi Riad', 'Noussair Mazraoui',
  'Neil El Aynaoui', 'Ayyoub Bouaddi', 'Brahim Diaz', 'Azzedine Ounahi', 'Bilal El Khannouss', 'Ismael Saibari',
  'Chemsdine Talbi', 'Samir El Mourabet', 'Anass Salah-Eddine', 'Ayoube Amaimouni', 'Soufiane Rahimi'
]);

-- ── Match 7: Haiti 0-1 Scotland (Sofascore lineups) ──
SELECT public.add_match_appearances(7, 'Haiti', ARRAY[
  'Johnny Placide', 'Carlens Arcus', 'Ricardo Ade', 'Hannes Delcroix', 'Martin Experience',
  'Louicius Deedson', 'Jean-Jacques Danley', 'Jeanricner Bellegarde', 'Ruben Providence',
  'Frantzdy Pierrot', 'Wilson Isidor', 'Josué Casimir', 'Lenny Joseph', 'Yassin Fortune'
]);

SELECT public.add_match_appearances(7, 'Scotland', ARRAY[
  'Angus Gunn', 'Andy Robertson', 'Jack Hendry', 'Grant Hanley', 'Aaron Hickey',
  'Lewis Ferguson', 'John McGinn', 'Scott McTominay', 'Ben Gannon-Doak', 'Che Adams', 'Lawrence Shankland',
  'Ryan Christie', 'Lyndon Dykes', 'Nathan Patterson', 'Findlay Curtis', 'Kenny McLean'
]);

-- ── Match 8: Australia 2-0 Türkiye (Sofascore lineups) ──
SELECT public.add_match_appearances(8, 'Australia', ARRAY[
  'Patrick Beach', 'Jordan Bos', 'Cameron Burgess', 'Harry Souttar', 'Alessandro Circati', 'Jacob Italiano',
  'Nestory Irankunda', 'Paul Okon-Engstler', 'Aiden O''Neill', 'Connor Metcalfe', 'Mohamed Toure',
  'Nishan Velupillay', 'Jason Geria', 'Tete Yengi', 'Jackson Irvine', 'Aziz Behich'
]);

SELECT public.add_match_appearances(8, 'Türkiye', ARRAY[
  'Ugurcan Cakir', 'Zeki Celik', 'Merih Demiral', 'Abdulkerim Bardakci', 'Ferdi Kadioglu',
  'Ismail Yuksek', 'Hakan Calhanoglu', 'Arda Guler', 'Orkun Kokcu', 'Baris Alper Yilmaz', 'Kerem Akturkoglu',
  'Kenan Yildiz', 'Yunus Akgun', 'Mert Muldur', 'Salih Ozcan', 'Deniz Gul'
]);

SELECT public.refresh_five_a_side_player_stats();
