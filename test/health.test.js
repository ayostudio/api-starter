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

describe('API /health', () => {
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
    .get('/health')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.health).to.equal("We're up and running healthy ✅");
    }));

  it('it should return 503', () => {
    mongoose.connection.close();
    return chai
      .request(server)
      .get('/health')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res.status).to.equal(500);
        expect(res.body.health).to.equal('Database is diconnected! ❌');
      });
  });
});
