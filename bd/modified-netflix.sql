USE netflix;
# MOVIES
SELECT * FROM movies;
SELECT title, genre FROM movies WHERE year > 1990;
SELECT * FROM movies WHERE category = 'Top 10';
UPDATE movies SET year = 1997 WHERE idMovies = 2;

# ACTORS
SELECT * FROM actors;
SELECT name, lastname FROM actors WHERE birthday BETWEEN '1950-01-01' AND '1960-01-01';
SELECT name, lastname FROM actors WHERE country = 'Estados Unidos';

# USERS
SELECT * FROM users WHERE plan_details = 'Standard';
DELETE FROM users WHERE name LIKE 'M%';

# BONUS
-- añadir columna a una tabla
ALTER TABLE actors ADD image text;
-- eliminar una tabla
CREATE TABLE paraborrar(
	dato1 varchar(10),
    dato2 varchar(9)
);
DROP TABLE paraborrar;
