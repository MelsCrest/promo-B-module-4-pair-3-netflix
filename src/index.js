const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.set('view engine', 'ejs');

async function connectDB() {
  const conection = await mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_team3',
    password: '55g#UTjMRp#Ekwb',
    database: 'freedb_netflix'
  })
  conection.connect();
  return conection;
}

const fakeMovies = [
  {
    id: 1,
    title: "Wonder Woman",
    genre: "Action",
    image:
      "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/12/gal-gadot-como-wonder-woman-universo-extendido-dc-2895594.jpg?tf=3840x",
    category: "Superhero",
    year: 2017,
    director: "Patty Jenkins",
  },
  {
    id: 2,
    title: "Inception",
    genre: "Science Fiction",
    image:
      "https://m.media-amazon.com/images/S/pv-target-images/e826ebbcc692b4d19059d24125cf23699067ab621c979612fd0ca11ab42a65cb._SX1080_FMjpg_.jpg",
    category: "Thriller",
    year: 2010,
    director: "Christopher Nolan",
  },
  {
    id: '3',
    title: 'Gambita de dama',
    genre: 'Drama',
    image:
      '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/gambito-de-dama.jpg'
  },
  {
    id: '4',
    title: 'Friends',
    genre: 'Comedia',
    image:
      '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/friends.jpg'
  }
];

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// ENPOINTS
// server.get("/movies", (req, res)=>{
//   res.status(200).json({
//     success: true,
//     movies:  fakeMovies
//   })
// });


// server.get("/movies", async (req, res)=>{
//   // crear el sql
//   const connection = await connectDB();
//   const sqlSelect = 'SELECT * FROM movies';
//   // ejectuar el sql en la base de datos
//   const [result, fields] = await connection.query(sqlSelect);
//   console.log(result);
//   console.log(fields); 
// });

// connectDB();

server.get("/movies", async (req, res)=>{
  try {
    console.log(req.query.genre);
    console.log(req.query.sort);

    const genreFilterParam = req.query.genre;
    const sortFilterParam = req.query.sort; // asc, desc

    const connection = await connectDB();

    // condicional: si genreFilterParam tiene algo, mandame una query, si no, la otra
    let sqlSelect;

    // crear el sql
    if (genreFilterParam === '') {
      sqlSelect = `SELECT * FROM movies ORDER BY title ${sortFilterParam}`;
    } else {
      sqlSelect = `SELECT * FROM movies WHERE genre = ? ORDER BY title ${sortFilterParam}`;
    };

    // ejectuar el sql en la base de datos
    const [result, fields] = await connection.query(sqlSelect, [genreFilterParam]);
    connection.end();

    if (result.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'No se encontraron películas'
      })
    } else {
      res.status(200).json({
        success: true,
        // movies: result.push(fakemovies)
        movies: result
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: error
    })
  };
});

//motor de plantillas
server.get('/movie/:movieId',async (req, res)=>{
  const {movieId} = req.params;
  const connection = await connectDB();
  const selectsql = 'SELECT * FROM movies WHERE idMovies = ?';
  const [foundMovie] = await connection.query(selectsql,[movieId]);
  console.log(foundMovie);
  res.render('movie', {movie : foundMovie[0]});
});

//registro
server.post("/sign-up", async(req, res)=>{
  const connection = await connectDB();
  const {email, password} = req.body;
  console.log(req.body);
  const selectEmail = "SELECT email FROM users WHERE email = ?";
  const [emailResult] = await connection.query(selectEmail, [email]);
  if(emailResult.length === 0){
    const passwordHashed = await bcrypt.hash(password, 10);
    const inserUser = "INSERT INTO users (email, password) VALUES (?, ?)";
    const [result] = await connection.query(inserUser, [email, passwordHashed]);
    res.status(200).json({
      success: true,
      userId: result.insertId
    });
  }else{
    res.status(200).json({
      success: false,
      errorMessage: "Usuario ya existente"
    });
  }
});