const { expect, use } = require('chai');
const mongoose = require('mongoose');
const sinonChai = require('sinon-chai');
const { Mockgoose } = require('mockgoose');
const {
  describe, it, before, after, beforeEach,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const authenticate = require('./authenticate');
const validation = require('./validation');

const mockgoose = new Mockgoose(mongoose);
const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
};

use(sinonChai);
use(chaiAsPromised);

before((done) => {
  mockgoose.prepareStorage().then(() => {
    mongoose.connect(
      'mongodb://localhost:27017/testing',
      { useNewUrlParser: true },
      (err) => {
        done(err);
      },
    );
  });
});

after((done) => {
  mongoose.connection.close();
  done();
});

describe('The validation utility', () => {
  describe('isEmail()', () => {
    it('should be a function', () => {
      expect(validation.isEmail).to.be.a('function');
    });

    it('should accept 1 arguments', () => {
      expect(validation.isEmail.length).to.equal(1);
    });

    it('should be false if the email is invalid', () => {
      expect(validation.isEmail('fake@something')).to.be.false;
    });

    it('should be true if the email is valid', () => {
      expect(validation.isEmail('fake@email.com')).to.be.true;
    });
  });

  describe('isUnique()', () => {
    beforeEach(() => mongoose.model('User').deleteMany({}));

    it('should be a function', () => {
      expect(validation.isUnique).to.be.a('function');
    });

    it('should accept 1 arguments', () => {
      expect(validation.isUnique.length).to.equal(1);
    });

    it('should be false if the email is already in use', () => authenticate
      .registerUser(testUser)
      .then(
        () => expect(validation.isUnique(testUser.email, 'user', 'email')).to.eventually.be.false,
      ));

    it('should be true if the email is not already in use', () => expect(validation.isUnique(testUser.email, 'user', 'email')).to.eventually.be.true);

    it('should default to use the users model', () => expect(validation.isUnique(testUser.email)).to.eventually.be.true);

    it('error if something went wrong with the function', () => expect(validation.isUnique(testUser.email, 'fakeModel', 'email')).to.eventually.be.an(
      'error',
    ));
  });

  describe('doesContain()', () => {
    it('should be a function', () => {
      expect(validation.doesContain).to.be.a('function');
    });

    it('should accept 2 arguments', () => {
      expect(validation.doesContain.length).to.equal(2);
    });

    it('should be false if the item is not in the string', () => {
      expect(validation.doesContain('hello', 'hi, test')).to.be.false;
    });

    it('should be true if the item is in the string', () => {
      expect(validation.doesContain('hello', 'hello, test')).to.be.true;
    });
  });

  describe('isIn()', () => {
    it('should be a function', () => {
      expect(validation.isIn).to.be.a('function');
    });

    it('should accept 2 arguments', () => {
      expect(validation.isIn.length).to.equal(2);
    });

    it('should be false if the item is not in the array', () => {
      expect(validation.isIn(['hi', 'bye'], 'hello')).to.be.false;
    });

    it('should be true if the item is in the array', () => {
      expect(validation.isIn(['hello', 'goodbye'], 'hello')).to.be.true;
    });
  });

  describe('buildValidationResponse()', () => {
    it('should be a function', () => {
      expect(validation.buildValidationResponse).to.be.a('function');
    });

    it('should accept 1 arguments', () => {
      expect(validation.buildValidationResponse.length).to.equal(1);
    });

    it('should return an object when you pass a valid validation response', () => {
      const validationResponse = {
        email: {
          message: 'Something with the email',
          value: 'something',
        },
      };
      expect(validation.buildValidationResponse(validationResponse)).to.be.an('object');
    });

    it("should return an error when you don't pass a valid validation response", () => {
      expect(validation.buildValidationResponse('hello')).to.be.an('error');
    });
  });
});
