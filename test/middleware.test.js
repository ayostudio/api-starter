const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {
  describe, it, before, after, afterEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');
const server = require('../app/server')(true);
const app = require('../app/utils/app');
const authenticate = require('../app/utils/authenticate');
const config = require('../app/config');

const mockgoose = new Mockgoose(mongoose);
const { expect } = chai;

chai.use(chaiHttp);

const testApp = {
  name: 'testApp',
  description: 'this is a test application',
  userId: 'testUserId',
};

const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
  type: 'individual',
  country: 'GB',
  termsSigned: true,
};

describe('API middleware', () => {
  before(() => mockgoose.prepareStorage().then(() => mongoose.connect(
    'mongodb://localhost:27017/testing',
    { useNewUrlParser: true },
  )));

  after((done) => {
    mongoose.connection.close();
    done();
  });

  afterEach((done) => {
    mongoose.model('User').deleteMany({}, () => {
      done();
    });
  });

  it('should return 422 when no app key is provided', () => chai
    .request(server)
    .get('/api/v1/user')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.body.message).to.equal('You need to include you app key.');
      expect(res.status).to.equal(422);
    }));

  it('should return 401 when invalid app key is provided', () => chai
    .request(server)
    .get('/api/v1/user?app=fakeKey')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('No app found');
    }));

  it('should return 401 when you are trying to access an admin route without an admin key', () => app.createApp(testApp).then(storedAppp => chai
    .request(server)
    .post(`/api/v1/auth/login?app=${storedAppp.testPublic}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal(
        'Unauthorized, only admin apps can use these endpoints.',
      );
    })));

  it('should return 200 when you have included an app key', () => app.createApp(testApp).then(storedAppp => chai
    .request(server)
    .get(`/api/v1/countries/supported?app=${storedAppp.testPublic}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(200);
    })));

  it('should return 200 when you have included an admin key', () => chai
    .request(server)
    .get(`/api/v1/countries/supported?app=${config.adminKey}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(200);
    }));

  it('should handle errors correctly', () => chai
    .request(server)
    .get("/api/v1/countries/supported?app=blsls{}qdqw£45w'")
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(401);
    }));

  it('should error when trying to access a user authenticated on another app', () => app.createApp(testApp).then(storedApp => authenticate
    .registerUser(testUser)
    .then(user => authenticate.getAccessToken(user, storedApp.liveSecret))
    .then(response => chai
      .request(server)
      .get(`/api/v1/user?app=${config.adminKey}`)
      .set('Authorization', `bearer ${response.token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(401);
      }))));

  it('should success when trying to access a user authenticated on the same app', () => app.createApp(testApp).then(storedApp => authenticate
    .registerUser(testUser)
    .then(user => authenticate.getAccessToken(user, storedApp.liveSecret))
    .then(response => chai
      .request(server)
      .get(`/api/v1/user?app=${storedApp.livePublic}`)
      .set('Authorization', `bearer ${response.token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(200);
      }))));
});
