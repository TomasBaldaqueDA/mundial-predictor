-- National team jersey numbers (2026 World Cup official / recent international numbers).
-- Excludes Brazil and Portugal (110/111). USA in 067_usa_squad.sql.

-- Algeria
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Melvin Mastil', 1),
  ('Aissa Mandi', 2),
  ('Achref Abada', 3),
  ('Mohamed Amine Tougai', 4),
  ('Zineddine Belaid', 5),
  ('Ramiz Zerrouki', 6),
  ('Riyad Mahrez', 7),
  ('Houssem Aouar', 8),
  ('Amine Gouiri', 9),
  ('Fares Chaibi', 10),
  ('Anis Hadj Moussa', 11),
  ('Nadhir Benbouali', 12),
  ('Jaouen Hadjam', 13),
  ('Hicham Boudaoui', 14),
  ('Rayan Ait-Nouri', 15),
  ('Oussama Benbot', 16),
  ('Rafik Belghali', 17),
  ('Mohamed Amoura', 18),
  ('Nabil Bentaleb', 19),
  ('Adil Boulbina', 20),
  ('Ramy Bensebaini', 21),
  ('Ibrahim Maza', 22),
  ('Luca Zidane', 23),
  ('Yacine Titraoui', 24),
  ('Fares Ghedjemis', 25),
  ('Samir Chergui', 26)) AS v(name, num)
WHERE p.team = 'Algeria' AND p.name = v.name;

-- Argentina
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Juan Musso', 1),
  ('Leonardo Balerdi', 2),
  ('Nicolas Tagliafico', 3),
  ('Gonzalo Montiel', 4),
  ('Leandro Paredes', 5),
  ('Lisandro Martinez', 6),
  ('Rodrigo De Paul', 7),
  ('Valentin Barco', 8),
  ('Julian Alvarez', 9),
  ('Lionel Messi', 10),
  ('Giovani Lo Celso', 11),
  ('Geronimo Rulli', 12),
  ('Cristian Romero', 13),
  ('Exequiel Palacios', 14),
  ('Nicolas Gonzalez', 15),
  ('Thiago Almada', 16),
  ('Giuliano Simeone', 17),
  ('Nicolas Paz', 18),
  ('Nicolas Otamendi', 19),
  ('Alexis Mac Allister', 20),
  ('Jose Manuel Lopez', 21),
  ('Lautaro Martinez', 22),
  ('Emiliano Martinez', 23),
  ('Enzo Fernandez', 24),
  ('Facundo Medina', 25),
  ('Nahuel Molina', 26)) AS v(name, num)
WHERE p.team = 'Argentina' AND p.name = v.name;

-- Australia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Maty Ryan', 1),
  ('Milos Degenek', 2),
  ('Alessandro Circati', 3),
  ('Jacob Italiano', 4),
  ('Jordan Bos', 5),
  ('Jason Geria', 6),
  ('Mathew Leckie', 7),
  ('Connor Metcalfe', 8),
  ('Mohamed Toure', 9),
  ('Ajdin Hrustic', 10),
  ('Awer Mabil', 11),
  ('Paul Izzo', 12),
  ('Aiden O''Neill', 13),
  ('Cameron Devlin', 14),
  ('Kai Trewin', 15),
  ('Aziz Behich', 16),
  ('Nestory Irankunda', 17),
  ('Patrick Beach', 18),
  ('Harry Souttar', 19),
  ('Cristian Volpato', 20),
  ('Cameron Burgess', 21),
  ('Jackson Irvine', 22),
  ('Nishan Velupillay', 23),
  ('Paul Okon-Engstler', 24),
  ('Lucas Herrington', 25),
  ('Tete Yengi', 26)) AS v(name, num)
WHERE p.team = 'Australia' AND p.name = v.name;

-- Austria
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Alexander Schlager', 1),
  ('David Affengruber', 2),
  ('Kevin Danso', 3),
  ('Xaver Schlager', 4),
  ('Stefan Posch', 5),
  ('Nicolas Seiwald', 6),
  ('Marko Arnautovic', 7),
  ('David Alaba', 8),
  ('Marcel Sabitzer', 9),
  ('Florian Grillitsch', 10),
  ('Michael Gregoritsch', 11),
  ('Florian Wiegele', 12),
  ('Patrick Pentz', 13),
  ('Sasa Kalajdzic', 14),
  ('Philipp Lienhart', 15),
  ('Phillipp Mwene', 16),
  ('Carney Chukwuemeka', 17),
  ('Romano Schmid', 18),
  ('Christoph Baumgartner', 19),
  ('Konrad Laimer', 20),
  ('Patrick Wimmer', 21),
  ('Alexander Prass', 22),
  ('Marco Friedl', 23),
  ('Paul Wanner', 24),
  ('Michael Svoboda', 25),
  ('Alessandro Schopf', 26)) AS v(name, num)
WHERE p.team = 'Austria' AND p.name = v.name;

-- Belgium
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Thibaut Courtois', 1),
  ('Zeno Debast', 2),
  ('Arthur Theate', 3),
  ('Brandon Mechele', 4),
  ('Maxim De Cuyper', 5),
  ('Axel Witsel', 6),
  ('Kevin De Bruyne', 7),
  ('Youri Tielemans', 8),
  ('Romelu Lukaku', 9),
  ('Leandro Trossard', 10),
  ('Jeremy Doku', 11),
  ('Senne Lammens', 12),
  ('Mike Penders', 13),
  ('Dodi Lukebakio', 14),
  ('Thomas Meunier', 15),
  ('Koni De Winter', 16),
  ('Charles De Ketelaere', 17),
  ('Joaquin Seys', 18),
  ('Diego Moreira', 19),
  ('Hans Vanaken', 20),
  ('Timothy Castagne', 21),
  ('Alexis Saelemaekers', 22),
  ('Nicolas Raskin', 23),
  ('Amadou Onana', 24),
  ('Nathan Ngoy', 25),
  ('Matias Fernandez-Pardo', 26)) AS v(name, num)
WHERE p.team = 'Belgium' AND p.name = v.name;

-- Bosnia and Herzegovina
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Nikola Vasilj', 1),
  ('Nihad Mujakić', 2),
  ('Dennis Hadzikadunic', 3),
  ('Tarik Muharemović', 4),
  ('Sead Kolašinac', 5),
  ('Benjamin Tahirovic', 6),
  ('Amar Dedić', 7),
  ('Armin Gigovic', 8),
  ('Samed Bazdar', 9),
  ('Ermedin Demirovic', 10),
  ('Edin Dzeko', 11),
  ('Osman Hadžikić', 12),
  ('Ivan Basic', 13),
  ('Ivan Sunjic', 14),
  ('Amar Memic', 15),
  ('Amir Hadziahmetovic', 16),
  ('Dzenis Burnic', 17),
  ('Nikola Katić', 18),
  ('Kerim Alajbegovic', 19),
  ('Esmir Bajraktarevic', 20),
  ('Stjepan Radeljić', 21),
  ('Martin Zlomislić', 22),
  ('Haris Tabakovic', 23),
  ('Nidal Čelik', 24),
  ('Jovo Lukic', 25),
  ('Ermin Mahmic', 26)) AS v(name, num)
WHERE p.team = 'Bosnia and Herzegovina' AND p.name = v.name;

-- Cabo Verde
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Vozinha', 1),
  ('Ianique Dos Santos Tavares', 2),
  ('Diney Borges', 3),
  ('Roberto Lopes', 4),
  ('Logan Costa', 5),
  ('Kevin Pina', 6),
  ('Jovane Cabral', 7),
  ('Joao Paulo Fernandes', 8),
  ('Gilson Benchimol', 9),
  ('Jamiro Monteiro', 10),
  ('Garry Rodrigues', 11),
  ('Marcio Rosa', 12),
  ('Sidny Cabral', 13),
  ('Deroy Duarte', 14),
  ('Laros Duarte', 15),
  ('Yannick Semedo', 16),
  ('Willy Semedo', 17),
  ('Telmo Arcanjo', 18),
  ('Dailon Livramento', 19),
  ('Ryan Mendes', 20),
  ('Nuno Da Costa', 21),
  ('Steven Moreira', 22),
  ('CJ Dos Santos', 23),
  ('Wagner Pina', 24),
  ('Kelvin Pires', 25),
  ('Helio Varela', 26)) AS v(name, num)
WHERE p.team = 'Cabo Verde' AND p.name = v.name;

-- Canada
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Dayne St. Clair', 1),
  ('Alistair Johnston', 2),
  ('Alfie Jones', 3),
  ('Luc de Fougerolles', 4),
  ('Joel Waterman', 5),
  ('Mathieu Choiniere', 6),
  ('Stephen Eustaquio', 7),
  ('Ismael Kone', 8),
  ('Cyle Larin', 9),
  ('Jonathan David', 10),
  ('Liam Millar', 11),
  ('Tani Oluwaseyi', 12),
  ('Derek Cornelius', 13),
  ('Jacob Shaffelburg', 14),
  ('Moise Bombito', 15),
  ('Maxime Crepeau', 16),
  ('Tajon Buchanan', 17),
  ('Owen Goodman', 18),
  ('Alphonso Davies', 19),
  ('Ali Ahmed', 20),
  ('Jonathan Osorio', 21),
  ('Richie Laryea', 22),
  ('Niko Sigur', 23),
  ('Promise David', 24),
  ('Nathan-Dylan Saliba', 25),
  ('Marcelo Flores', 26)) AS v(name, num)
WHERE p.team = 'Canada' AND p.name = v.name;

-- Colombia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('David Ospina', 1),
  ('Daniel Munoz', 2),
  ('Jhon Lucumi', 3),
  ('Santiago Arias', 4),
  ('Kevin Castano', 5),
  ('Richard Rios', 6),
  ('Luis Diaz', 7),
  ('Jorge Carrascal', 8),
  ('Jhon Cordoba', 9),
  ('James Rodriguez', 10),
  ('Jhon Arias', 11),
  ('Camilo Vargas', 12),
  ('Yerry Mina', 13),
  ('Gustavo Puerta', 14),
  ('Juan Portilla', 15),
  ('Jefferson Lerma', 16),
  ('Johan Mojica', 17),
  ('Willer Ditta', 18),
  ('Juan Camilo Hernandez', 19),
  ('Juan Fernando Quintero', 20),
  ('Jaminton Campaz', 21),
  ('Deiver Machado', 22),
  ('Davinson Sanchez', 23),
  ('Alvaro Montero', 24),
  ('Luis Suarez', 25),
  ('Carlos Gomez', 26)) AS v(name, num)
WHERE p.team = 'Colombia' AND p.name = v.name;

-- Congo DR
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Lionel Mpasi', 1),
  ('Aaron Wan-Bissaka', 2),
  ('Steve Kapuadi', 3),
  ('Alex Tuanzebe', 4),
  ('Dylan Batubinsika', 5),
  ('Ngal''ayel Mukau', 6),
  ('Nathanael Mbuku', 7),
  ('Samuel Moutoussamy', 8),
  ('Brian Cipenga', 9),
  ('Theo Bongonda', 10),
  ('Gael Kakuta', 11),
  ('Joris Kayembe', 12),
  ('Meschack Elia', 13),
  ('Noah Sadiki', 14),
  ('Aaron Tshibola', 15),
  ('Thimothy Fayulu', 16),
  ('Cedric Bakambu', 17),
  ('Charles Pickel', 18),
  ('Fiston Mayele', 19),
  ('Yoane Wissa', 20),
  ('Matthieu Epolo', 21),
  ('Chancel Mbemba', 22),
  ('Simon Banza', 23),
  ('Gédéon Kalulu', 24),
  ('Edo Kayembe', 25),
  ('Arthur Masuaku', 26)) AS v(name, num)
WHERE p.team = 'Congo DR' AND p.name = v.name;

-- Croatia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Dominik Livakovic', 1),
  ('Josip Stanisic', 2),
  ('Marin Pongracic', 3),
  ('Josko Gvardiol', 4),
  ('Duje Caleta-Car', 5),
  ('Josip Sutalo', 6),
  ('Nikola Moro', 7),
  ('Mateo Kovacic', 8),
  ('Andrej Kramaric', 9),
  ('Luka Modric', 10),
  ('Ante Budimir', 11),
  ('Ivor Pandur', 12),
  ('Nikola Vlasic', 13),
  ('Ivan Perisic', 14),
  ('Mario Pasalic', 15),
  ('Martin Baturina', 16),
  ('Petar Sucic', 17),
  ('Kristijan Jakic', 18),
  ('Toni Fruk', 19),
  ('Igor Matanovic', 20),
  ('Luka Sucic', 21),
  ('Luka Vuskovic', 22),
  ('Dominik Kotarski', 23),
  ('Marco Pasalic', 24),
  ('Martin Erlic', 25),
  ('Petar Musa', 26)) AS v(name, num)
WHERE p.team = 'Croatia' AND p.name = v.name;

-- Curaçao
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Eloy Room', 1),
  ('Shurandy Sambo', 2),
  ('Jurien Gaari', 3),
  ('Roshon Van Eijma', 4),
  ('Sherel Floranus', 5),
  ('Godfried Roemeratoe', 6),
  ('Juninho Bacuna', 7),
  ('Livano Comenencia', 8),
  ('Jurgen Locadia', 9),
  ('Leandro Bacuna', 10),
  ('Jeremy Antonisse', 11),
  ('Sontje Hansen', 12),
  ('Tyrese Noslin', 13),
  ('Kenji Gorré', 14),
  ('Ar''jany Martha', 15),
  ('Jearl Margaritha', 16),
  ('Brandley Kuwas', 17),
  ('Armando Obispo', 18),
  ('Gervane Kastaneer', 19),
  ('Joshua Brenet', 20),
  ('Tahith Chong', 21),
  ('Kevin Felida', 22),
  ('Riechedly Bazoer', 23),
  ('Deveron Fonville', 24),
  ('Tyrick Bodak', 25),
  ('Trevor Doornbusch', 26)) AS v(name, num)
WHERE p.team = 'Curaçao' AND p.name = v.name;

-- Czechia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Matej Kovar', 1),
  ('David Zima', 2),
  ('Tomas Holes', 3),
  ('Robin Hranac', 4),
  ('Vladimir Coufal', 5),
  ('Stepan Chaloupek', 6),
  ('Ladislav Krejci', 7),
  ('Vladimir Darida', 8),
  ('Adam Hlozek', 9),
  ('Patrik Schick', 10),
  ('Jan Kuchta', 11),
  ('Lukas Cerv', 12),
  ('Mojmir Chytil', 13),
  ('David Jurasek', 14),
  ('Pavel Sulc', 15),
  ('Jindrich Stanek', 16),
  ('Lukas Provod', 17),
  ('Michal Sadilek', 18),
  ('Tomas Chory', 19),
  ('Jaroslav Zeleny', 20),
  ('David Doudera', 21),
  ('Tomas Soucek', 22),
  ('Lukas Hornicek', 23),
  ('Alexandr Sojka', 24),
  ('Hugo Sochurek', 25),
  ('Denis Visinsky', 26)) AS v(name, num)
WHERE p.team = 'Czechia' AND p.name = v.name;

-- Côte d'Ivoire
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Yahia Fofana', 1),
  ('Ousmane Diomande', 2),
  ('Ghislain Konan', 3),
  ('Jean-Michael Seri', 4),
  ('Wilfried Singo', 5),
  ('Seko Fofana', 6),
  ('Odilon Kossounou', 7),
  ('Franck Kessie', 8),
  ('Ange-Yoan Bonny', 9),
  ('Simon Adingra', 10),
  ('Yan Diomande', 11),
  ('Elye Wahi', 12),
  ('Clement Akpa', 13),
  ('Oumar Diakite', 14),
  ('Amad Diallo', 15),
  ('Mohamed Kone', 16),
  ('Guela Doué', 17),
  ('Ibrahim Sangare', 18),
  ('Nicolas Pepe', 19),
  ('Emmanuel Agbadou', 20),
  ('Evan Ndicka', 21),
  ('Evann Guessand', 22),
  ('Alban Lafont', 23),
  ('Bazoumana Toure', 24),
  ('Parfait Guiagon', 25),
  ('Christ Inao Oulai', 26)) AS v(name, num)
WHERE p.team = 'Côte d''Ivoire' AND p.name = v.name;

-- Ecuador
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Hernán Galíndez', 1),
  ('Felix Torres', 2),
  ('Piero Hincapié', 3),
  ('José Ordóñez', 4),
  ('John Hurtado', 5),
  ('William Pacho', 6),
  ('Pervis Estupiñán', 7),
  ('José Chávez', 8),
  ('Jeremy Yeboah', 9),
  ('Kendry Páez', 10),
  ('Kevin Rodríguez', 11),
  ('Moises Ramírez', 12),
  ('Enner Valencia', 13),
  ('Antonio Minda', 14),
  ('Pedro Vite', 15),
  ('Jeremy Caicedo', 16),
  ('Ángelo Preciado', 17),
  ('Diego Castillo', 18),
  ('Gonzalo Plata', 19),
  ('Nelson Angulo', 20),
  ('Alan Franco', 21),
  ('Diego Cabezas', 22),
  ('Xavier Arreaga', 23),
  ('Leonardo Campana', 24),
  ('Junior Méndez', 25),
  ('Jhon Corozo', 26)) AS v(name, num)
WHERE p.team = 'Ecuador' AND p.name = v.name;

-- Egypt
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Mohamed El Shenawy', 1),
  ('Yasser Ibrahim', 2),
  ('Mohamed Hany', 3),
  ('Hossam Abdelmaguid', 4),
  ('Ramy Rabia', 5),
  ('Mohamed Abdelmonem', 6),
  ('Mahmoud Trezeguet', 7),
  ('Emam Ashour', 8),
  ('Hamza Abdel Karim', 9),
  ('Mohamed Salah', 10),
  ('Mostafa Ziko', 11),
  ('Haitham Hassan', 12),
  ('Ahmed Fatouh', 13),
  ('Hamdi Fathy', 14),
  ('Karim Hafez', 15),
  ('El Mahdi Soliman', 16),
  ('Mohannad Lasheen', 17),
  ('Nabil Emad Dunga', 18),
  ('Marwan Attia', 19),
  ('Ibrahim Adel', 20),
  ('Mahmoud Saber', 21),
  ('Omar Marmoush', 22),
  ('Mostafa Shobeir', 23),
  ('Tarek Alaa', 24),
  ('Ahmed Sayed Zizo', 25),
  ('Mohamed Alaa', 26),
  ('Aktay Abdallah', 27)) AS v(name, num)
WHERE p.team = 'Egypt' AND p.name = v.name;

-- England
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Jordan Pickford', 1),
  ('Ezri Konsa', 2),
  ('Nico O''Reilly', 3),
  ('Declan Rice', 4),
  ('John Stones', 5),
  ('Marc Guehi', 6),
  ('Bukayo Saka', 7),
  ('Elliott Anderson', 8),
  ('Harry Kane', 9),
  ('Jude Bellingham', 10),
  ('Marcus Rashford', 11),
  ('Tino Livramento', 12),
  ('Dean Henderson', 13),
  ('Jordan Henderson', 14),
  ('Dan Burn', 15),
  ('Kobbie Mainoo', 16),
  ('Morgan Rogers', 17),
  ('Anthony Gordon', 18),
  ('Ollie Watkins', 19),
  ('Noni Madueke', 20),
  ('Eberechi Eze', 21),
  ('Ivan Toney', 22),
  ('James Trafford', 23),
  ('Reece James', 24),
  ('Djed Spence', 25),
  ('Jarell Quansah', 26)) AS v(name, num)
WHERE p.team = 'England' AND p.name = v.name;

-- France
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Brice Samba', 1),
  ('Malo Gusto', 2),
  ('Lucas Digne', 3),
  ('Dayot Upamecano', 4),
  ('Jules Kounde', 5),
  ('Manu Kone', 6),
  ('Ousmane Dembele', 7),
  ('Aurelien Tchouameni', 8),
  ('Marcus Thuram', 9),
  ('Kylian Mbappe', 10),
  ('Michael Olise', 11),
  ('Bradley Barcola', 12),
  ('N''Golo Kante', 13),
  ('Adrien Rabiot', 14),
  ('Ibrahima Konate', 15),
  ('Mike Maignan', 16),
  ('William Saliba', 17),
  ('Warren Zaire-Emery', 18),
  ('Theo Hernandez', 19),
  ('Desire Doue', 20),
  ('Lucas Hernandez', 21),
  ('Jean-Philippe Mateta', 22),
  ('Robin Risser', 23),
  ('Rayan Cherki', 24),
  ('Maghnes Akliouche', 25),
  ('Maxence Lacroix', 26)) AS v(name, num)
WHERE p.team = 'France' AND p.name = v.name;

-- Germany
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Manuel Neuer', 1),
  ('Antonio Rüdiger', 2),
  ('Waldemar Anton', 3),
  ('Jonathan Tah', 4),
  ('Aleksandar Pavlovic', 5),
  ('Joshua Kimmich', 6),
  ('Kai Havertz', 7),
  ('Leon Goretzka', 8),
  ('Jamie Leweling', 9),
  ('Jamal Musiala', 10),
  ('Nick Woltemade', 11),
  ('Oliver Baumann', 12),
  ('Pascal Groß', 13),
  ('Maximilian Beier', 14),
  ('Nico Schlotterbeck', 15),
  ('Angelo Stiller', 16),
  ('Florian Wirtz', 17),
  ('Nathaniel Brown', 18),
  ('Leroy Sané', 19),
  ('Nadiem Amiri', 20),
  ('Alexander Nübel', 21),
  ('David Raum', 22),
  ('Felix Nmecha', 23),
  ('Malick Thiaw', 24),
  ('Lennart Karl', 25),
  ('Deniz Undav', 26)) AS v(name, num)
WHERE p.team = 'Germany' AND p.name = v.name;

-- Ghana
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Lawrence Ati-Zigi', 1),
  ('Alidu Seidu', 2),
  ('Caleb Yirenkyi', 3),
  ('Jonas Adjetey', 4),
  ('Thomas Partey', 5),
  ('Abdul Mumin', 6),
  ('Abdul Fatawu Issahaku', 7),
  ('Kwasi Sibo', 8),
  ('Jordan Ayew', 9),
  ('Brandon Thomas-Asante', 10),
  ('Antoine Semenyo', 11),
  ('Joseph Anang', 12),
  ('Christopher Bonsu Baah', 13),
  ('Gideon Mensah', 14),
  ('Elisha Owusu', 15),
  ('Benjamin Asare', 16),
  ('Baba Abdul Rahman', 17),
  ('Jerome Opoku', 18),
  ('Inaki Williams', 19),
  ('Augustine Boakye', 20),
  ('Kojo Oppong Peprah', 21),
  ('Kamaldeen Sulemana', 22),
  ('Derrick Luckassen', 23),
  ('Ernest Nuamah', 24),
  ('Prince Kwabena Adu', 25),
  ('Marvin Senaya', 26)) AS v(name, num)
WHERE p.team = 'Ghana' AND p.name = v.name;

-- Haiti
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Johnny Placide', 1),
  ('Carlens Arcus', 2),
  ('Keeto Thermoncy', 3),
  ('Ricardo Ade', 4),
  ('Hannes Delcroix', 5),
  ('Carl-Fred Sainthe', 6),
  ('Derrick Etienne', 7),
  ('Martin Experience', 8),
  ('Duckens Nazon', 9),
  ('Jeanricner Bellegarde', 10),
  ('Louicius Deedson', 11),
  ('Alexandre Pierre', 12),
  ('Duke Lacroix', 13),
  ('Leverton Pierre', 14),
  ('Ruben Providence', 15),
  ('Lenny Joseph', 16),
  ('Jean-Jacques Danley', 17),
  ('Wilson Isidor', 18),
  ('Yassin Fortune', 19),
  ('Frantzdy Pierrot', 20),
  ('Josué Casimir', 21),
  ('JK Duverne', 22),
  ('Josué Duverger', 23),
  ('Wilguens Paugvain', 24),
  ('Dominique Simon', 25),
  ('Pierre Woodenski', 26)) AS v(name, num)
WHERE p.team = 'Haiti' AND p.name = v.name;

-- IR Iran
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Alireza Beiranvand', 1),
  ('Saleh Hardani', 2),
  ('Ehsan Hajsafi', 3),
  ('Shoja Khalilzadeh', 4),
  ('Milad Mohammadi', 5),
  ('Saeid Ezatolahi', 6),
  ('Alireza Jahanbakhsh', 7),
  ('Mohammad Mohebi', 8),
  ('Mehdi Taremi', 9),
  ('Mehdi Ghaedi', 10),
  ('Ali Alipour', 11),
  ('Payam Niazmand', 12),
  ('Hossein Kanaani', 13),
  ('Saman Ghoddos', 14),
  ('Rouzbeh Cheshmi', 15),
  ('Mehdi Torabi', 16),
  ('Aria Yousefi', 17),
  ('Amirhossein Hosseinzadeh', 18),
  ('Ali Nemati', 19),
  ('Shahriar Moghanlou', 20),
  ('Mohammad Ghorbani', 21),
  ('Seyed Hossein Hosseini', 22),
  ('Ramin Rezaeian', 23),
  ('Dennis Dargahi', 24),
  ('Danial Eiri', 25),
  ('Amir Mohammad Razzaghinia', 26)) AS v(name, num)
WHERE p.team = 'IR Iran' AND p.name = v.name;

-- Iraq
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Fahad Talib', 1),
  ('Rebin Sulaka', 2),
  ('Hussein Ali', 3),
  ('Zaid Tahseen', 4),
  ('Akam Hashim', 5),
  ('Manaf Younis', 6),
  ('Youssef Amyn', 7),
  ('Ibrahim Bayesh', 8),
  ('Ali Al-Hamadi', 9),
  ('Mohanad Ali', 10),
  ('Ahmed Qasem', 11),
  ('Jalal Hassan', 12),
  ('Ali Yousef', 13),
  ('Zidane Iqbal', 14),
  ('Ahmed Yahya', 15),
  ('Amir Al-Ammari', 16),
  ('Ali Jassim', 17),
  ('Aymen Hussein', 18),
  ('Kevin Yakob', 19),
  ('Aimar Sher', 20),
  ('Marko Farji', 21),
  ('Ahmed Basil', 22),
  ('Merchas Doski', 23),
  ('Zaid Ismail', 24),
  ('Mustafa Saadoon', 25),
  ('Frans Putros', 26)) AS v(name, num)
WHERE p.team = 'Iraq' AND p.name = v.name;

-- Japan
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Zion Suzuki', 1),
  ('Yukinari Sugawara', 2),
  ('Shogo Taniguchi', 3),
  ('Ko Itakura', 4),
  ('Yuto Nagatomo', 5),
  ('Wataru Endo', 6),
  ('Ao Tanaka', 7),
  ('Takefusa Kubo', 8),
  ('Keisuke Goto', 9),
  ('Ritsu Doan', 10),
  ('Daizen Maeda', 11),
  ('Keisuke Osako', 12),
  ('Keito Nakamura', 13),
  ('Junya Ito', 14),
  ('Daichi Kamada', 15),
  ('Tsuyoshi Watanabe', 16),
  ('Yuito Suzuki', 17),
  ('Ayase Ueda', 18),
  ('Koki Ogawa', 19),
  ('Ayumu Seko', 20),
  ('Hiroki Ito', 21),
  ('Takehiro Tomiyasu', 22),
  ('Tomoki Hayakawa', 23),
  ('Kaishu Sano', 24),
  ('Junosuke Suzuki', 25),
  ('Kento Shiogai', 26)) AS v(name, num)
WHERE p.team = 'Japan' AND p.name = v.name;

-- Jordan
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Yazeed Abulaila', 1),
  ('Mohammad Abu Hashish', 2),
  ('Abdallah Nasib', 3),
  ('Husam Abu Dahab', 4),
  ('Yazan Al-Arab', 5),
  ('Amer Jamous', 6),
  ('Mohammad Abu Zrayq', 7),
  ('Noor Al-Rawabdeh', 8),
  ('Ali Olwan', 9),
  ('Musa Al-Taamari', 10),
  ('Odeh Al-Fakhouri', 11),
  ('Nour Bani Attiah', 12),
  ('Mahmoud Al-Mardi', 13),
  ('Rajaei Ayed', 14),
  ('Ibrahim Sadeh', 15),
  ('Mo Abualnadi', 16),
  ('Salim Obaid', 17),
  ('Ibrahim Sabra', 18),
  ('Saed Al-Rosan', 19),
  ('Mohannad Abu Taha', 20),
  ('Nizar Al-Rashdan', 21),
  ('Abdallah Al-Fakhouri', 22),
  ('Ihsan Haddad', 23),
  ('Ali Azaizeh', 24),
  ('Mohammad Al-Dawoud', 25),
  ('Anas Badawi', 26)) AS v(name, num)
WHERE p.team = 'Jordan' AND p.name = v.name;

-- Korea Republic
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Kim Seung-gyu', 1),
  ('Lee Han-beom', 2),
  ('Lee Ki-hyuk', 3),
  ('Kim Min-jae', 4),
  ('Kim Tae-hyeon', 5),
  ('Hwang In-beom', 6),
  ('Son Heung-min', 7),
  ('Paik Seung-ho', 8),
  ('Cho Gue-sung', 9),
  ('Lee Jae-sung', 10),
  ('Hwang Hee-chan', 11),
  ('Song Bum-keun', 12),
  ('Lee Tae-seok', 13),
  ('Cho Yu-min', 14),
  ('Kim Moon-hwan', 15),
  ('Park Jin-seob', 16),
  ('Bae Jun-ho', 17),
  ('Oh Hyeong-yu', 18),
  ('Lee Kan-gin', 19),
  ('Yang Hyun-jun', 20),
  ('Jo Hyeon-woo', 21),
  ('Seol Young-woo', 22),
  ('Jens Castrop', 23),
  ('Kim Jin-gyu', 24),
  ('Eom Ji-sung', 25),
  ('Lee Dongg-yeong', 26)) AS v(name, num)
WHERE p.team = 'Korea Republic' AND p.name = v.name;

-- Mexico
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Raul Rangel', 1),
  ('Jorge Sanchez', 2),
  ('Cesar Montes', 3),
  ('Edson Alvarez', 4),
  ('Johan Vasquez', 5),
  ('Erik Lira', 6),
  ('Luis Romo', 7),
  ('Alvaro Fidalgo', 8),
  ('Raul Jimenez', 9),
  ('Alexis Vega', 10),
  ('Santiago Gimenez', 11),
  ('Carlos Acevedo', 12),
  ('Guillermo Ochoa', 13),
  ('Armando Gonzalez', 14),
  ('Israel Reyes', 15),
  ('Julian Quinones', 16),
  ('Orbelin Pineda', 17),
  ('Obed Vargas', 18),
  ('Gilberto Mora', 19),
  ('Mateo Chavez', 20),
  ('Cesar Huerta', 21),
  ('Guillermo Martinez', 22),
  ('Jesus Gallardo', 23),
  ('Luis Chavez', 24),
  ('Roberto Alvarado', 25),
  ('Brian Gutierrez', 26)) AS v(name, num)
WHERE p.team = 'Mexico' AND p.name = v.name;

-- Morocco
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Yassine Bounou', 1),
  ('Achraf Hakimi', 2),
  ('Noussair Mazraoui', 3),
  ('Sofyan Amrabat', 4),
  ('Nayef Aguerd', 5),
  ('Ayyoub Bouaddi', 6),
  ('Chemsdine Talbi', 7),
  ('Azzedine Ounahi', 8),
  ('Soufiane Rahimi', 9),
  ('Brahim Diaz', 10),
  ('Ismael Saibari', 11),
  ('Munir El Kajoui', 12),
  ('Zakaria El Ouahdi', 13),
  ('Issa Diop', 14),
  ('Samir El Mourabet', 15),
  ('Gessime Yassine', 16),
  ('Abde Ezzalzouli', 17),
  ('Chadi Riad', 18),
  ('Youssef Belammari', 19),
  ('Ayoub El Kaabi', 20),
  ('Ayoube Amaimouni', 21),
  ('Reda Tagnaouti', 22),
  ('Bilal El Khannouss', 23),
  ('Neil El Aynaoui', 24),
  ('Redouane Halhal', 25),
  ('Anass Salah-Eddine', 26)) AS v(name, num)
WHERE p.team = 'Morocco' AND p.name = v.name;

-- Netherlands
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Bart Verbruggen', 1),
  ('Jurriën Timber', 2),
  ('Marten de Roon', 3),
  ('Virgil van Dijk', 4),
  ('Nathan Aké', 5),
  ('Jan Paul van Hecke', 6),
  ('Justin Kluivert', 7),
  ('Ryan Gravenberch', 8),
  ('Wout Weghorst', 9),
  ('Memphis Depay', 10),
  ('Cody Gakpo', 11),
  ('Mats Wieffer', 12),
  ('Robin Roefs', 13),
  ('Tijjani Reijnders', 14),
  ('Micky van de Ven', 15),
  ('Guus Til', 16),
  ('Noa Lang', 17),
  ('Donyell Malen', 18),
  ('Brian Brobbey', 19),
  ('Teun Koopmeiners', 20),
  ('Frenkie de Jong', 21),
  ('Denzel Dumfries', 22),
  ('Mark Flekken', 23),
  ('Crysencio Summerville', 24),
  ('Jorrel Hato', 25),
  ('Quinten Timber', 26)) AS v(name, num)
WHERE p.team = 'Netherlands' AND p.name = v.name;

-- New Zealand
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Max Crocombe', 1),
  ('Tim Payne', 2),
  ('Francis de Vries', 3),
  ('Tyler Bindon', 4),
  ('Michael Boxall', 5),
  ('Joe Bell', 6),
  ('Matt Garbett', 7),
  ('Marko Stamenic', 8),
  ('Chris Wood', 9),
  ('Sarpreet Singh', 10),
  ('Eli Just', 11),
  ('Alex Paulsen', 12),
  ('Liberato Cacace', 13),
  ('Alex Rufer', 14),
  ('Nando Pijnaker', 15),
  ('Finn Surman', 16),
  ('Kosta Barbarouses', 17),
  ('Ben Waine', 18),
  ('Ben Old', 19),
  ('Callum McCowatt', 20),
  ('Jesse Randall', 21),
  ('Michael Woud', 22),
  ('Ryan Thomas', 23),
  ('Callan Elliot', 24),
  ('Lachlan Bayliss', 25),
  ('Tommy Smith', 26)) AS v(name, num)
WHERE p.team = 'New Zealand' AND p.name = v.name;

-- Norway
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Orjan Haskjold Nyland', 1),
  ('Morten Thorsby', 2),
  ('Kristoffer Vassbakk Ajer', 3),
  ('Leo Ostigard', 4),
  ('David Moller Wolfe', 5),
  ('Patrick Berg', 6),
  ('Alexander Sorloth', 7),
  ('Sander Berge', 8),
  ('Erling Haaland', 9),
  ('Martin Odegaard', 10),
  ('Jorgen Strand Larsen', 11),
  ('Sander Tangvik', 12),
  ('Egil Selvik', 13),
  ('Fredrik Aursnes', 14),
  ('Fredrik Bjorkan', 15),
  ('Marcus Holmgren Pedersen', 16),
  ('Torbjorn Heggem', 17),
  ('Kristian Thorstvedt', 18),
  ('Thelonious Aasgaard', 19),
  ('Antonio Nusa', 20),
  ('Andreas Schjelderup', 21),
  ('Oscar Bobb', 22),
  ('Jens Petter Hauge', 23),
  ('Sondre Langas', 24),
  ('Henrik Falchener', 25),
  ('Julian Ryerson', 26)) AS v(name, num)
WHERE p.team = 'Norway' AND p.name = v.name;

-- Panama
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Luis Mejia', 1),
  ('Cesar Blackman', 2),
  ('Jose Cordoba', 3),
  ('Fidel Escobar', 4),
  ('Edgardo Farina', 5),
  ('Cristian Martinez', 6),
  ('Jose Luis Rodriguez', 7),
  ('Adalberto Carrasquilla', 8),
  ('Tomas Rodriguez', 9),
  ('Ismael Diaz', 10),
  ('Yoel Barcenas', 11),
  ('Cesar Samudio', 12),
  ('Jiovany Ramos', 13),
  ('Carlos Harvey', 14),
  ('Eric Davis', 15),
  ('Andres Andrade', 16),
  ('Jose Fajardo', 17),
  ('Cecilio Waterman', 18),
  ('Alberto Quintero', 19),
  ('Anibal Godoy', 20),
  ('Cesar Yanis', 21),
  ('Orlando Mosquera', 22),
  ('Amir Murillo', 23),
  ('Azarias Londono', 24),
  ('Roderick Miller', 25),
  ('Jorge Gutierrez', 26)) AS v(name, num)
WHERE p.team = 'Panama' AND p.name = v.name;

-- Paraguay
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Roberto Junior Fernandez', 1),
  ('Gustavo Velazquez', 2),
  ('Omar Alderete', 3),
  ('Juan Jose Caceres', 4),
  ('Fabian Balbuena', 5),
  ('Junior Alonso', 6),
  ('Ramon Sosa', 7),
  ('Diego Gomez', 8),
  ('Antonio Sanabria', 9),
  ('Miguel Almiron', 10),
  ('Mauricio Magalhaes', 11),
  ('Orlando Gill', 12),
  ('Jose Canale', 13),
  ('Andres Cubas', 14),
  ('Gustavo Gomez', 15),
  ('Damian Bobadilla', 16),
  ('Alejandro Romero', 17),
  ('Alex Arce', 18),
  ('Julio Enciso', 19),
  ('Briaian Ojeda', 20),
  ('Gabriel Avalos', 21),
  ('Gaston Olveira', 22),
  ('Matias Galarza', 23),
  ('Gustavo Caballero', 24),
  ('Isidro Pitta', 25),
  ('Alexandro Maidana', 26)) AS v(name, num)
WHERE p.team = 'Paraguay' AND p.name = v.name;

-- Qatar
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Mahmoud Abunada', 1),
  ('Pedro Miguel', 2),
  ('Lucas Mendes', 3),
  ('Issa Laaye', 4),
  ('Jassem Jaber', 5),
  ('Abdulaziz Hatem', 6),
  ('Ahmed Alaa', 7),
  ('Edmilson Junior', 8),
  ('Mohammed Muntari', 9),
  ('Hassan Al-Haydos', 10),
  ('Akram Afif', 11),
  ('Karim Boudiaf', 12),
  ('Ayoub Alawi', 13),
  ('Homam Al-Amin', 14),
  ('Youssef Abdulrazzaq', 15),
  ('Boualem Khoukhi', 16),
  ('Ahmed Al-Janahi', 17),
  ('Sultan Al-Brake', 18),
  ('Almoez Ali', 19),
  ('Ahmed Fathi', 20),
  ('Salah Zakaria', 21),
  ('Meshaal Barsham', 22),
  ('Assim Madibo', 23),
  ('Tahseen Mohammed', 24),
  ('Hashmi Hussein', 25),
  ('Mohammed Al-Manai', 26)) AS v(name, num)
WHERE p.team = 'Qatar' AND p.name = v.name;

-- Saudi Arabia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Nawaf Al Aqidi', 1),
  ('Ali Majrashi', 2),
  ('Ali Lajami', 3),
  ('Abdulelah Al Amri', 4),
  ('Hassan Tambakti', 5),
  ('Nasser Al Dawsari', 6),
  ('Musab Al Juwayr', 7),
  ('Ayman Yahya', 8),
  ('Firas Al Buraikan', 9),
  ('Salem Al Dawsari', 10),
  ('Saleh Al Shehri', 11),
  ('Saud Abdulhamid', 12),
  ('Nawaf Boushal', 13),
  ('Hassan Kadesh', 14),
  ('Abdullah Al Khaibari', 15),
  ('Ziyad Al Johani', 16),
  ('Khalid Al Ghannam', 17),
  ('Alaa Al Hajji', 18),
  ('Abdullah Al Hamdan', 19),
  ('Sultan Al-Ghannam', 20),
  ('Mohammed Al Owais', 21),
  ('Ahmed Al Kassar', 22),
  ('Mohammed Kanno', 23),
  ('Moteb Al Harbi', 24),
  ('Jehad Thikri', 25),
  ('Mohammed Abu Al Shamat', 26)) AS v(name, num)
WHERE p.team = 'Saudi Arabia' AND p.name = v.name;

-- Scotland
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Angus Gunn', 1),
  ('Aaron Hickey', 2),
  ('Andy Robertson', 3),
  ('Scott McTominay', 4),
  ('Grant Hanley', 5),
  ('Kieran Tierney', 6),
  ('John McGinn', 7),
  ('Billy Gilmour', 8),
  ('Lyndon Dykes', 9),
  ('Che Adams', 10),
  ('Ryan Christie', 11),
  ('Liam Kelly', 12),
  ('Jack Hendry', 13),
  ('Ross Stewart', 14),
  ('John Souttar', 15),
  ('Dom Hyam', 16),
  ('Ben Gannon-Doak', 17),
  ('George Hirst', 18),
  ('Lewis Ferguson', 19),
  ('Lawrence Shankland', 20),
  ('Craig Gordon', 21),
  ('Nathan Patterson', 22),
  ('Kenny McLean', 23),
  ('Anthony Ralston', 24),
  ('Findlay Curtis', 25),
  ('Scott McKenna', 26)) AS v(name, num)
WHERE p.team = 'Scotland' AND p.name = v.name;

-- Senegal
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Yehvann Diouf', 1),
  ('Mamadou Sarr', 2),
  ('Kalidou Koulibaly', 3),
  ('Abdoulaye Seck', 4),
  ('Idrissa Gana Gueye', 5),
  ('Pathe Ciss', 6),
  ('Assane Diao', 7),
  ('Lamine Camara', 8),
  ('Bamba Dieng', 9),
  ('Sadio Mane', 10),
  ('Nicolas Jackson', 11),
  ('Cherif Ndiaye', 12),
  ('Iliman Ndiaye', 13),
  ('Ismail Jakobs', 14),
  ('Krepin Diatta', 15),
  ('Edouard Mendy', 16),
  ('Pape Matar Sarr', 17),
  ('Ismaila Sarr', 18),
  ('Moussa Niakhate', 19),
  ('Ibrahim Mbaye', 20),
  ('Habib Diarra', 21),
  ('Bara Sapoko Ndiaye', 22),
  ('Mory Diaw', 23),
  ('Antoine Mendy', 24),
  ('El Hadji Malick Diouf', 25),
  ('Pape Gueye', 26)) AS v(name, num)
WHERE p.team = 'Senegal' AND p.name = v.name;

-- South Africa
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Ronwen Williams', 1),
  ('Thabang Matuludi', 2),
  ('Khulumani Ndamane', 3),
  ('Teboho Mokoena', 4),
  ('Thalente Mbatha', 5),
  ('Aubrey Modiba', 6),
  ('Oswin Appollis', 7),
  ('Tshepang Moremi', 8),
  ('Lyle Foster', 9),
  ('Relebohile Mofokeng', 10),
  ('Themba Zwane', 11),
  ('Thapelo Maseko', 12),
  ('Sphephelo Sithole', 13),
  ('Mbekezeli Mbokazi', 14),
  ('Iqraam Rayners', 15),
  ('Sipho Chaine', 16),
  ('Evidence Makgopa', 17),
  ('Samukele Kabini', 18),
  ('Nkosinathi Sibisi', 19),
  ('Khuliso Mudau', 20),
  ('Ime Okon', 21),
  ('Ricardo Goss', 22),
  ('Jayden Adams', 23),
  ('Olwethu Makhanya', 24),
  ('Kamogelo Sebelebele', 25),
  ('Bradley Cross', 26)) AS v(name, num)
WHERE p.team = 'South Africa' AND p.name = v.name;

-- Spain
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('David Raya', 1),
  ('Marc Pubill', 2),
  ('Álejandro Grimaldo', 3),
  ('Eric García', 4),
  ('Marcos Llorente', 5),
  ('Mikel Merino', 6),
  ('Ferran Torres', 7),
  ('Fabián Ruiz', 8),
  ('Gavi', 9),
  ('Dani Olmo', 10),
  ('Yéremy Pino', 11),
  ('Pedro Porro', 12),
  ('Joan García', 13),
  ('Aymeric Laporte', 14),
  ('Álex Baena', 15),
  ('Rodri', 16),
  ('Nico Williams', 17),
  ('Martín Zubimendi', 18),
  ('Lamine Yamal', 19),
  ('Pedri', 20),
  ('Mikel Oyarzabal', 21),
  ('Pau Cubarsí', 22),
  ('Unai Simón', 23),
  ('Marc Cucurella', 24),
  ('Víctor Muñoz', 25),
  ('Borja Iglesias', 26)) AS v(name, num)
WHERE p.team = 'Spain' AND p.name = v.name;

-- Sweden
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Jacob Widell Zetterstrom', 1),
  ('Gustaf Lagerbielke', 2),
  ('Victor Lindelof', 3),
  ('Isak Hien', 4),
  ('Gabriel Gudmundsson', 5),
  ('Emil Holm', 6),
  ('Lucas Bergvall', 7),
  ('Daniel Svensson', 8),
  ('Alexander Isak', 9),
  ('Benjamin Nygren', 10),
  ('Anthony Elanga', 11),
  ('Viktor Johansson', 12),
  ('Ken Sema', 13),
  ('Hjalmar Ekdal', 14),
  ('Carl Starfelt', 15),
  ('Jesper Karlstrom', 16),
  ('Viktor Gyokeres', 17),
  ('Yasin Ayari', 18),
  ('Mattias Svanberg', 19),
  ('Erik Smith', 20),
  ('Alexander Bernhardsson', 21),
  ('Besfort Zeneli', 22),
  ('Kristoffer Nordfeldt', 23),
  ('Elliot Stroud', 24),
  ('Gustaf Nilsson', 25),
  ('Taha Ali', 26)) AS v(name, num)
WHERE p.team = 'Sweden' AND p.name = v.name;

-- Switzerland
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Gregor Kobel', 1),
  ('Miro Muheim', 2),
  ('Silvan Widmer', 3),
  ('Nico Elvedi', 4),
  ('Manuel Akanji', 5),
  ('Denis Zakaria', 6),
  ('Breel Embolo', 7),
  ('Remo Freuler', 8),
  ('Johan Manzambi', 9),
  ('Granit Xhaka', 10),
  ('Dan Ndoye', 11),
  ('Yvon Mvogo', 12),
  ('Ricardo Rodriguez', 13),
  ('Ardon Jashari', 14),
  ('Djibril Sow', 15),
  ('Christian Fassnacht', 16),
  ('Ruben Vargas', 17),
  ('Eray Cömert', 18),
  ('Noah Okafor', 19),
  ('Michel Aebischer', 20),
  ('Marvin Keller', 21),
  ('Fabian Rieder', 22),
  ('Zeki Amdouni', 23),
  ('Aurèle Amenda', 24),
  ('Luca Jaquez', 25),
  ('Cedric Itten', 26)) AS v(name, num)
WHERE p.team = 'Switzerland' AND p.name = v.name;

-- Tunisia
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Abdelmouhib Chamakh', 1),
  ('Ali Abdi', 2),
  ('Montassar Talbi', 3),
  ('Omar Rekik', 4),
  ('Adem Arous', 5),
  ('Dylan Bronn', 6),
  ('Elias Achouri', 7),
  ('Elias Saad', 8),
  ('Hazem Mastouri', 9),
  ('Hannibal Mejbri', 10),
  ('Ismael Gharbi', 11),
  ('Mortadha Ben Ouanes', 12),
  ('Rani Khedira', 13),
  ('Khalil Ayari', 14),
  ('Hadj Mahmoud', 15),
  ('Aymen Dahmene', 16),
  ('Ellyes Skhiri', 17),
  ('Rayan Elloumi', 18),
  ('Firas Chaouat', 19),
  ('Yan Valery', 20),
  ('Mohamed Amine Ben Hamida', 21),
  ('Sabri Ben Hassan', 22),
  ('Moutaz Neffati', 23),
  ('Raed Chikhaoui', 24),
  ('Anis Ben Slimane', 25),
  ('Sebastian Tounekti', 26)) AS v(name, num)
WHERE p.team = 'Tunisia' AND p.name = v.name;

-- Türkiye
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Mert Gunok', 1),
  ('Zeki Celik', 2),
  ('Merih Demiral', 3),
  ('Caglar Soyuncu', 4),
  ('Salih Ozcan', 5),
  ('Orkun Kokcu', 6),
  ('Kerem Akturkoglu', 7),
  ('Arda Guler', 8),
  ('Deniz Gul', 9),
  ('Hakan Calhanoglu', 10),
  ('Kenan Yildiz', 11),
  ('Altay Bayindir', 12),
  ('Eren Elmali', 13),
  ('Abdulkerim Bardakci', 14),
  ('Ozan Kabak', 15),
  ('Ismail Yuksek', 16),
  ('Irfan Can Kahveci', 17),
  ('Mert Muldur', 18),
  ('Yunus Akgun', 19),
  ('Ferdi Kadioglu', 20),
  ('Baris Alper Yilmaz', 21),
  ('Kaan Ayhan', 22),
  ('Ugurcan Cakir', 23),
  ('Oguz Aydin', 24),
  ('Samet Akaydin', 25),
  ('Can Uzun', 26)) AS v(name, num)
WHERE p.team = 'Türkiye' AND p.name = v.name;

-- Uruguay
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Sergio Rochet', 1),
  ('Jose Maria Gimenez', 2),
  ('Sebastian Caceres', 3),
  ('Ronald Araujo', 4),
  ('Manuel Ugarte', 5),
  ('Rodrigo Bentancur', 6),
  ('Nicolas de la Cruz', 7),
  ('Federico Valverde', 8),
  ('Darwin Nunez', 9),
  ('Giorgian de Arrascaeta', 10),
  ('Facundo Pellistri', 11),
  ('Santiago Mele', 12),
  ('Guillermo Varela', 13),
  ('Agustin Canobbio', 14),
  ('Emiliano Martinez', 15),
  ('Mathias Olivera', 16),
  ('Matias Vina', 17),
  ('Brian Rodriguez', 18),
  ('Rodrigo Aguirre', 19),
  ('Maxi Araujo', 20),
  ('Federico Vinas', 21),
  ('Joaquin Piquerez', 22),
  ('Fernando Muslera', 23),
  ('Santiago Bueno', 24),
  ('Juan Manuel Sanabria', 25),
  ('Rodrigo Zalazar', 26)) AS v(name, num)
WHERE p.team = 'Uruguay' AND p.name = v.name;

-- Uzbekistan
UPDATE public.five_a_side_players AS p
SET jersey_number = v.num
FROM (VALUES
  ('Utkir Yusupov', 1),
  ('Abdukodir Khusanov', 2),
  ('Khojiakbar Alijonov', 3),
  ('Farrukh Sayfiev', 4),
  ('Rustam Ashurmatov', 5),
  ('Akmal Mozgovoy', 6),
  ('Otabek Shukurov', 7),
  ('Jamshid Iskanderov', 8),
  ('Odiljon Hamrobekov', 9),
  ('Jaloliddin Masharipov', 10),
  ('Oston Urunov', 11),
  ('Abduvohid Nematov', 12),
  ('Sherzod Nasrullaev', 13),
  ('Eldor Shomurodov', 14),
  ('Umar Eshmurodov', 15),
  ('Botirali Ergashev', 16),
  ('Dostonbek Khamdamov', 17),
  ('Abdulla Abdullaev', 18),
  ('Azizjon Ganiev', 19),
  ('Azizbek Amonov', 20),
  ('Igor Sergeev', 21),
  ('Abbosbek Fayzullaev', 22),
  ('Sherzod Esanov', 23),
  ('Bekhruz Karimov', 24),
  ('Avazbek Ulmasaliev', 25),
  ('Jakhongir Urozov', 26)) AS v(name, num)
WHERE p.team = 'Uzbekistan' AND p.name = v.name;

SELECT public.refresh_five_a_side_player_stats();
