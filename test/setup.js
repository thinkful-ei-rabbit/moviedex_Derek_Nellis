const { expect } = require('chai');
const supertest = require('supertest');
const mockData = require('../films.json');

global.expect = expect;
global.supertest = supertest;
global.mockData = mockData;
// Incomplete search terms baked-in to tests
global.validParams = {
  genre: 'Animati',
  country: 'Unite',
  avg_vote: 7
};
// Array needed for map() in app.test
global.invalidParams = [{ genre: 'g' }, { country: 'c' }, { avg_vote: 11 }];
