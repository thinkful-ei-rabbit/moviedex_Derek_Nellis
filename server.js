require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const FILMS = require('./films.json');

const API_TOKEN = process.env.API_TOKEN;

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

app.use('/movie', function paramValidator(req, res, next) {
  const { genre, country, avg_vote } = req.query;

  if (genre && genre.length < 3) {
    return res
      .status(400)
      .json('Genre must be at least 3 characters in length.');
  }

  if (country && country.length < 3) {
    return res
      .status(400)
      .json('Country must be at least 3 characters in length.');
  }

  const vote = Number(avg_vote);
  if (avg_vote) {
    if (isNaN(vote) || vote < 0 || vote > 10) {
      return res
        .status(400)
        .json('Invalid rating: must be number between 0-10');
    }
  }

  next();
});

const movieFilters = {
  genreFilter: (genre, results) => {
    results = results.filter(film =>
      film.genre.toLowerCase().includes(genre.toLowerCase())
    );
    return results;
  },
  countryFilter: (country, results) => {
    results = results.filter(film =>
      film.genre.toLowerCase().includes(country.toLowerCase())
    );
    return results;
  },
  avgVoteFilter: (avg_vote, results) => {
    results = results.filter(film =>
      Number(film.avg_vote) >= Number(avg_vote)
    );
    return results;
  }
};

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  const { genreFilter, countryFilter, avgVoteFilter } = movieFilters;
  let results = [...FILMS];

  if (genre) results = genreFilter(genre, results);
  if (country) results = countryFilter(country, results);
  if (avg_vote) results = avgVoteFilter(avg_vote, results);

  if (!results.length) return res.json('Sorry, no results found.');
  res.json(results);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Loading Express . . . running on http://localhost:${PORT}`);
});
