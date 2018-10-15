const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const server = require('../app/server')(true);
const config = require('../app/config');

chai.use(chaiHttp);

describe('API /v1/countries', () => {
  describe('/supported', () => {
    it('it should return 200', () => chai
      .request(server)
      .get(`/api/v1/countries/supported?app=${config.adminKey}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.countries).to.be.an('array');
      }));

    it('it should return an object containing an array of supported countries', () => chai
      .request(server)
      .get(`/api/v1/countries/supported?app=${config.adminKey}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .then((res) => {
        chai.expect(res.body.countries).to.be.an('array');
      }));
  });
});
