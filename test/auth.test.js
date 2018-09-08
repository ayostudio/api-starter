const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {
  describe, it, before, after, afterEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');
const server = require('../app/server')(true);
const authentication = require('../app/utils/authenticate');

const mockgoose = new Mockgoose(mongoose);
const { expect } = chai;

chai.use(chaiHttp);

const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
};

describe('API /v1/auth', () => {
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

  describe('/register', () => {
    afterEach((done) => {
      mongoose.model('User').deleteMany({}, (err) => {
        done(err);
      });
    });

    it('should register a user and return a token', () => chai
      .request(server)
      .post('/api/v1/auth/register')
      .send(testUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
      }));

    it('should return a 422 if required information is missing', () => chai
      .request(server)
      .post('/api/v1/auth/register')
      .send({ ...testUser, name: null })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));
  });

  describe('/login', () => {
    it('should login a user and return a token', () => authentication
      .registerUser(testUser)
      .then(() => chai.request(server)
        .post('/api/v1/auth/login')
        .send(testUser)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json'))
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
      }));

    it('should return a 422 if required information is missing', () => chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ ...testUser, email: null })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));

    it('should return a 422 if information is incorrect', () => chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ ...testUser, email: 'fake@user.com' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));
  });
});
