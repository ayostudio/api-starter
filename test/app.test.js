const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {
  describe, it, before, after, afterEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');
const config = require('../app/config');
const server = require('../app/server')(true);
const authentication = require('../app/utils/authenticate');

const mockgoose = new Mockgoose(mongoose);
const { expect } = chai;

chai.use(chaiHttp);

const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
  type: 'individual',
  country: 'GB',
  termsSigned: true,
};

const testApp = {
  name: 'Test App',
  description: 'Test application',
};

describe('API /v1/apps', () => {
  before(() => mockgoose.prepareStorage().then(() => mongoose.connect(
    'mongodb://localhost:27017/testing',
    { useNewUrlParser: true },
  )));

  after((done) => {
    mongoose.connection.close();
    done();
  });

  describe('POST /', () => {
    afterEach((done) => {
      mongoose.model('User').deleteMany({}, () => {
        mongoose.model('App').deleteMany({}, () => {
          done();
        });
      });
    });

    it('should create an application', () => authentication
      .registerUser(testUser)
      .then(() => authentication.authenticate(testUser))
      .then(user => authentication.getAccessToken(user, config.adminKey))
      .then(response => chai
        .request(server)
        .post(`/api/v1/apps?app=${config.adminKey}`)
        .send(testApp)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${response.token}`)
        .then((appRes) => {
          expect(appRes.status).to.equal(200);
          expect(appRes.body.app).to.be.a('object');
        })));

    it('should return a 401 if the app is not an admin app', () => chai
      .request(server)
      .post('/api/v1/apps?app=fakeKey')
      .then((res) => {
        expect(res.status).to.equal(401);
      }));

    it('should return a 422 if required information is missing', () => authentication
      .registerUser(testUser)
      .then(() => authentication.authenticate(testUser))
      .then(user => authentication.getAccessToken(user, config.adminKey))
      .then(response => chai
        .request(server)
        .post(`/api/v1/apps?app=${config.adminKey}`)
        .send({ ...testApp, name: null })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${response.token}`)
        .then((appRes) => {
          expect(appRes.status).to.equal(422);
        })));
  });
});
