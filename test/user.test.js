const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {
  describe, it, before, after, beforeEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);
const { expect } = chai;
const server = require('../app/server')(true);
const authentication = require('../app/utils/authenticate');

chai.use(chaiHttp);

const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
};

describe('API /api/v1/user', () => {
  before(() => mockgoose.prepareStorage().then(() => mongoose.connect(
    'mongodb://localhost:27017/testing',
    { useNewUrlParser: true },
  )));

  after((done) => {
    mongoose.model('User').deleteMany({}, (err) => {
      mongoose.connection.close();
      done(err);
    });
  });

  describe('/', () => {
    beforeEach((done) => {
      mongoose.model('User').deleteMany({}, err => done(err));
    });

    it('it should return 200 when passed a valid token', () => authentication
      .registerUser(testUser)
      .then(() => authentication.authenticate(testUser))
      .then(authentication.getAccessToken)
      .then(response => chai
        .request(server)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${response.token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).to.equal(200);
        })));

    it('it should return 401 when passed an invalid token', () => chai
      .request(server)
      .get('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer fakeToken')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(401);
      }));

    it("it should return 401 when haven't passed a token", () => chai
      .request(server)
      .get('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(401);
      }));
  });
});
