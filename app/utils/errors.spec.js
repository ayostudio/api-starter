const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const {
  describe, it, beforeEach, afterEach,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const errors = require('./errors');

use(sinonChai);
use(chaiAsPromised);

describe('The errors utility', () => {
  describe('handleErrors()', () => {
    const res = {
      status: sinon.stub(),
    };
    const jsonStub = sinon.stub();

    beforeEach(() => {
      res.status.returns({ json: jsonStub });
    });

    afterEach(() => {
      res.status.reset();
      jsonStub.reset();
    });

    it('should return a 422 when getting the error of ValidationError', () => {
      const err = new Error();
      err.name = 'ValidationError';
      err.errors = {
        email: {
          message: 'email missing',
        },
      };
      errors.handleErrors(err, res);

      const argument = jsonStub.getCall(0).args[0];
      expect(res.status.calledWith(422)).to.be.true;
      expect(argument.errors.email.message).to.equal('email missing');
    });

    it('should return a 500 when getting a error object', () => {
      errors.handleErrors({ message: 'there was an error' }, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return a 422 when getting the error of UserExistsError', () => {
      const err = new Error();
      err.name = 'UserExistsError';
      errors.handleErrors(err, res);

      const argument = jsonStub.getCall(0).args[0];
      expect(argument.errors.email.message).to.equal('Email already in use');
      expect(res.status.calledWith(422)).to.be.true;
    });

    it('should return a 422 when getting the error of MissingUsernameError', () => {
      const err = new Error();
      err.name = 'MissingUsernameError';
      errors.handleErrors(err, res);
      const argument = jsonStub.getCall(0).args[0];
      expect(argument.errors.email.message).to.equal('Email is required');
      expect(res.status.calledWith(422)).to.be.true;
    });

    it('should return a 422 when getting the error of MissingPasswordError', () => {
      const err = new Error();
      err.name = 'MissingPasswordError';
      errors.handleErrors(err, res);
      const argument = jsonStub.getCall(0).args[0];
      expect(argument.errors.password.message).to.equal('Password is required');
      expect(res.status.calledWith(422)).to.be.true;
    });

    it('should return a 422 when getting a error', () => {
      errors.handleErrors(new Error('test message'), res);
      const argument = jsonStub.getCall(0).args[0];
      expect(argument.error).to.equal('test message');
      expect(res.status.calledWith(422)).to.be.true;
    });
  });
});
