const { expect, use } = require('chai');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const sinonChai = require('sinon-chai');
const {
  describe, it, before, after, afterEach,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const authenticate = require('./authenticate');

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

describe('The authentication utility', () => {
  describe('registerUser()', () => {
    afterEach(() => mongoose.model('User').deleteMany({}));

    it('should be a function', () => {
      expect(authenticate.registerUser).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(authenticate.registerUser.length).to.equal(1);
    });

    it('should successfully create a new user when passed a valid user object', () => authenticate.registerUser(testUser).then((user) => {
      expect(user._doc).to.be.an('object');
      expect(user._doc).to.have.all.keys([
        '_id',
        'email',
        'name',
        'salt',
        'hash',
        'createdAt',
        'updatedAt',
        '__v',
      ]);
    }));

    it('should return an error when passed a user object with invalid email', () => {
      const invalidUser = { ...testUser, email: null };
      expect(authenticate.registerUser(invalidUser)).to.be.rejected;
      expect(authenticate.registerUser(invalidUser)).to.be.rejectedWith(Error);
      return authenticate.registerUser(invalidUser).catch((err) => {
        expect(err.name).to.equal('MissingUsernameError');
      });
    });

    it('should return an error when passed a user object with invalid password', () => {
      const invalidUser = {
        ...testUser,
        password: null,
        email: 'another@user.co',
      };

      expect(authenticate.registerUser(invalidUser)).to.be.rejected;
      expect(authenticate.registerUser(invalidUser)).to.be.rejectedWith(Error);
      return authenticate.registerUser(invalidUser).catch((err) => {
        expect(err.name).to.equal('MissingPasswordError');
      });
    });

    it('should return an error when passed a user object with a email which is already in use', () => authenticate
      .registerUser(testUser)
      .then((user) => {
        expect(authenticate.registerUser(user)).to.be.rejected;
        expect(authenticate.registerUser(user)).to.be.rejectedWith(Error);
        return user;
      })
      .then(user => authenticate.registerUser(user).catch((err) => {
        expect(err.name).to.equal('UserExistsError');
      })));
  });

  describe('authenticate()', () => {
    afterEach(() => mongoose.model('User').deleteMany({}));

    it('should be a function', () => {
      expect(authenticate.authenticate).to.be.a('function');
    });

    it('should return the user object', () => authenticate
      .registerUser(testUser)
      .then(() => authenticate.authenticate(testUser))
      .then((user) => {
        expect(user).to.be.an('object');
        expect(user).to.not.be.empty;
        expect(user.email).to.equal(testUser.email);
      }));

    it('should return an error when the user information is incorrect', () => {
      expect(
        authenticate.authenticate({ ...testUser, email: 'wrong@email.com' }),
      ).to.be.rejectedWith(Error);
      return authenticate.authenticate({ ...testUser, email: 'wrong@email.com' }).catch((err) => {
        expect(err.message).to.equal('User information incorrect');
      });
    });

    it('should return an error User.authenticate errors', () => {
      expect(authenticate.authenticate({ email: {}, password: {} })).to.be.rejectedWith(Error);
      return authenticate.authenticate({ email: {}, password: {} }).catch((err) => {
        expect(err.name).to.equal('Error');
      });
    });
  });

  describe('getAccessToken()', () => {
    afterEach(() => mongoose.model('User').deleteMany({}));

    it('should be a function', () => {
      expect(authenticate.getAccessToken).to.be.a('function');
    });

    it('should return an object containing the token and the user', () => authenticate
      .registerUser(testUser)
      .then(() => authenticate.authenticate(testUser))
      .then(authenticate.getAccessToken)
      .then((response) => {
        expect(response).to.be.an('object');
        expect(response.user).to.be.a('object');
        expect(response.token).to.be.a('string');
      }));

    it('should return an error when the user does not exist', () => authenticate
      .registerUser(testUser)
      .then(() => authenticate.authenticate(testUser))
      .then(() => {
        expect(authenticate.getAccessToken(null)).to.be.rejected;
        expect(authenticate.getAccessToken(null)).to.be.rejectedWith(Error);
      })
      .then(() => authenticate.getAccessToken(null).catch((err) => {
        expect(err.message).to.equal('User is missing');
      })));

    it('should return an error when the user is invalid', () => authenticate
      .registerUser(testUser)
      .then(() => authenticate.authenticate(testUser))
      .then(() => {
        expect(authenticate.getAccessToken({})).to.be.rejected;
        expect(authenticate.getAccessToken({})).to.be.rejectedWith(Error);
      })
      .then(() => authenticate.getAccessToken({}).catch((err) => {
        expect(err.message).to.equal('User is missing');
      })));
  });
});
