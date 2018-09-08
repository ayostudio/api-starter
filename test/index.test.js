const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {
  describe, it, before, after,
} = require('mocha');
const { Mockgoose } = require('mockgoose');
const server = require('../app/server')(true);

const mockgoose = new Mockgoose(mongoose);
const { expect } = chai;

chai.use(chaiHttp);

describe('API /', () => {
  before(() => mockgoose.prepareStorage().then(() => mongoose.connect(
    'mongodb://localhost:27017/testing',
    { useNewUrlParser: true },
  )));

  after((done) => {
    mongoose.connection.close();
    done();
  });

  it('it should return 200', () => chai
    .request(server)
    .get('/')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(200);
    }));

  it("it should return 404 when the route doesn't exist", () => chai
    .request(server)
    .get('/fakeRoute')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(404);
    }));
});
