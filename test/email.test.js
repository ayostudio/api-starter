const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {
  describe, it, before, after, beforeEach, afterEach,
} = require('mocha');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);
const server = require('../app/server')(true);
const authenticate = require('../app/utils/authenticate');

chai.use(chaiHttp);

const testUser = {
  email: 'test@email.com',
  password: 'password',
  name: 'Testy Test',
  type: 'individual',
  country: 'GB',
  termsSigned: true,
};

describe('API /emails', () => {
  before((done) => {
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        'mongodb://mongodb/testing',
        { useNewUrlParser: true },
        (err) => {
          done(err);
        },
      );
    });
  });

  after((done) => {
    mongoose.model('User').deleteMany({});
    mongoose.connection.close();
    done();
  });

  describe('/confirm', () => {
    beforeEach((done) => {
      authenticate.registerUser(testUser).then((user) => {
        this.user = user;
        done();
      });
    });

    afterEach((done) => {
      mongoose.model('User').deleteMany({}, () => {
        done();
      });
    });

    it('it should return 200 when user exists', () => chai
      .request(server)
      .get(`/emails/confirm?id=${this.user._id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res).to.have.status(200);
      }));

    it('it should return 422 when user does not exist', () => chai
      .request(server)
      .get('/emails/confirm?id=fakeId')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res).to.have.status(422);
      }));

    it('it should return 422 when user has not been sent', () => chai
      .request(server)
      .get('/emails/confirm?id=')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res).to.have.status(422);
      }));
  });
});
