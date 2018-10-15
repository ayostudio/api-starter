const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const http = require('http');
const {
  describe, it, before, after, afterEach, beforeEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');
const sinon = require('sinon');
const sgMail = require('@sendgrid/mail');
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

  describe('POST /register', () => {
    beforeEach(() => {
      this.sgMail = sinon.stub(sgMail, 'send').callsFake((msgObj, boolean, cb) => {
        if (msgObj.to.email === 'will@fail.com') {
          return cb(new Error('Something failed with sendgid'));
        }
        return cb(null);
      });

      this.http = sinon.stub(http, 'get').callsFake((endpoint, callback) => {
        callback({
          setEncoding: () => {},
          on: (data, cb) => cb('<body>fake test email</body>'),
          statusCode: endpoint.path.includes('force404') ? 404 : 200,
        });
      });
    });

    afterEach((done) => {
      this.sgMail.restore();
      this.http.restore();
      mongoose.model('User').deleteMany({}, () => {
        done();
      });
    });

    it('should register a user and return a token', () => chai
      .request(server)
      .post(`/api/v1/auth/register?app=${config.adminKey}`)
      .send(testUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
      }));

    it('should return a 401 if the app is not an admin app', () => chai
      .request(server)
      .post('/api/v1/auth/register?app=fakeKey')
      .send({ ...testUser, name: null })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(401);
      }));

    it('should return a 422 if required information is missing', () => chai
      .request(server)
      .post(`/api/v1/auth/register?app=${config.adminKey}`)
      .send({ ...testUser, name: null })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));
  });

  describe('POST /login', () => {
    it('should login a user and return a token', () => authentication
      .registerUser({ ...testUser, email: 'another@email.com' })
      .then(() => chai
        .request(server)
        .post(`/api/v1/auth/login?app=${config.adminKey}`)
        .send({ ...testUser, email: 'another@email.com' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json'))
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
      }));

    it('should return a 401 if the app is not an admin app', () => chai
      .request(server)
      .post('/api/v1/auth/login?app=fakeKey')
      .send(testUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(401);
      }));

    it('should return a 422 if required information is missing', () => chai
      .request(server)
      .post(`/api/v1/auth/login?app=${config.adminKey}`)
      .send({ ...testUser, email: null })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));

    it('should return a 422 if information is incorrect', () => chai
      .request(server)
      .post(`/api/v1/auth/login?app=${config.adminKey}`)
      .send({ ...testUser, email: 'fake@user.com' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.status).to.equal(422);
      }));
  });
});
