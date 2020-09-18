module.exports = {
  paramValidator: (genre, country, avg_vote) => {
    if (genre && genre.length < 3) {
      return 'genre';
    }

    if (country && country.length < 3) {
      return 'country';
    }

    const vote = Number(avg_vote);
    if (avg_vote) {
      if (isNaN(vote) || vote < 0 || vote > 10) {
        return 'avg_vote';
      }
    }

    return 'Validation successful!';
  },

  genreFilter: (genre, results) => {
    results = results.filter(film =>
      film.genre.toLowerCase().includes(genre.toLowerCase())
    );
    return results;
  },

  countryFilter: (country, results) => {
    results = results.filter(film =>
      film.country.toLowerCase().includes(country.toLowerCase())
    );
    return results;
  },

  avgVoteFilter: (avg_vote, results) => {
    results = results.filter(film => Number(film.avg_vote) >= Number(avg_vote));
    return results;
  }
};
