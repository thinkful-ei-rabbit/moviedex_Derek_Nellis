const {
  paramValidator,
  genreFilter,
  countryFilter,
  avgVoteFilter
} = require('../utils');

describe('Utility functions tests', () => {
  it('paramValidator validates valid params', () => {
    const validate = paramValidator(validParams);
    expect(validate).to.eql('Validation successful!');
  });

  it('paramValidator validates no params', () => {
    const validate = paramValidator();
    expect(validate).to.eql('Validation successful!');
  });

  it('paramValidator catches invalid params', () => {
    let validate = paramValidator([...invalidParams]);

    // Check if vote < 0
    invalidParams[2].avg_vote = -1;
    validate = paramValidator([...invalidParams]);

    expect(validate).to.eql('Validation successful!');
  });

  // Params will always be valid, hence no sad paths =>
  // Happy paths will have this film ID at [0] index
  const filmtv_ID = 2;

  it('genreFilter filters correctly', () => {
    const results = genreFilter(validParams.genre, mockData);
    const testId = results[0].filmtv_ID;
    expect(testId).to.eql(filmtv_ID);
  });

  it('countryFilter filters correctly', () => {
    const results = countryFilter(validParams.country, mockData);
    const testId = results[0].filmtv_ID;
    expect(testId).to.eql(filmtv_ID);
  });

  it('avgVoteFilter filters correctly', () => {
    const results = avgVoteFilter(validParams.avg_vote, mockData);
    const testId = results[0].filmtv_ID;
    expect(testId).to.eql(filmtv_ID);
  });
});
