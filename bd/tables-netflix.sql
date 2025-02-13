CREATE TABLE users_movies(
	id_users_movies int not null auto_increment primary key,
	fk_idUser int not null,
	fk_idMovies int not null,
	FOREIGN KEY (fk_idUser) REFERENCES users(idUser),
    FOREIGN KEY (fk_idMovies) REFERENCES movies(idMovies)
);

CREATE TABLE movies_actors(
	id_movies_actors int not null auto_increment primary key,
	fk_actors int not null,
	fk_movies int not null,
	FOREIGN KEY (fk_actors) REFERENCES actors(idActor),
    FOREIGN KEY (fk_movies) REFERENCES movies(idMovies)
);

ALTER TABLE users_movies ADD COLUMN score int;