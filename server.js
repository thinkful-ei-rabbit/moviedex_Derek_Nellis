require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const FILMS = require('./films.json');

const API_TOKEN = process.env.API_TOKEN;

const {
  paramValidator,
  genreFilter,
  countryFilter,
  avgVoteFilter
} = require('./utils');


const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/', function tokenValidator(req, res, next) {
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let results = [...FILMS];

  const validation = paramValidator(genre, country, avg_vote)
  if (validation === 'genre') {
    return res
      .status(400)
      .json('"genre" must be at least 3 characters in length.');
  }

  if (validation === 'country') {
    return res
      .status(400)
      .json('"country" must be at least 3 characters in length.');
  }

  if (validation === 'avg_vote') {
    return res
      .status(400)
      .json('Invalid rating: must be number between 0-10');
  }

  if (genre) results = genreFilter(genre, results);
  if (country) results = countryFilter(country, results);
  if (avg_vote) results = avgVoteFilter(avg_vote, results);

  if (!results.length) return res.json('Sorry, no results found.');
  res.json(results);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Loading Express . . . running on http://localhost:${PORT}`);
});

module.exports = app;
