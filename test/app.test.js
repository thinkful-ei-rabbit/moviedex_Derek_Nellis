const { expect } = require('chai');
const app = require('../server');

const API_TOKEN = process.env.API_TOKEN;

describe('Test server endpoints', () => {
  it('token validation throws error', () => {
    return supertest(app)
      .get('/movie')
      .expect(401)
      .then(res => {
        expect(res.body).to.eql({ error: 'Unauthorized request' });
      });
  });

  it('returns full list of movies', () => {
    return supertest(app)
      .get('/movie')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.eql(mockData);
      });
  });

  // Filtered data will have this film ID at [0] index
  const filmtv_ID = 2;
  it('returns filtered list of movies', () => {
    return supertest(app)
      .get('/movie')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .query(validParams)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const testId = res.body[0].filmtv_ID;
        expect(testId).to.eql(filmtv_ID);
      });
  });

  const nonsenseParams = {
    genre: 'zzz',
    country: 'zzz',
    avg_vote: 10
  };
  it('handles no results found', () => {
    return supertest(app)
      .get('/movie')
      .set('Authorization', 'Bearer ' + API_TOKEN)
      .query(nonsenseParams)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.eql('Sorry, no results found.');
      });
  });

  invalidParams.map(query => {
    const param = Object.keys(query);
    it(`Invalid ${param} throws error`, () => {
      return supertest(app)
        .get('/movie')
        .set('Authorization', 'Bearer ' + API_TOKEN)
        .query(query)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(res => {
          if (param[0] === 'avg_vote')
            expect(res.body).to.eql(
              'Invalid rating: must be number between 0-10'
            );
          else
            expect(res.body).to.eql(
              `"${param}" must be at least 3 characters in length.`
            );
        });
    });
  });
});
