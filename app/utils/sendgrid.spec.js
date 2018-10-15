const chai = require('chai');
const mongoose = require('mongoose');
const sinonChai = require('sinon-chai');
const http = require('http');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sgMail = require('@sendgrid/mail');
const { Mockgoose } = require('mockgoose');
const {
  describe, it, before, after, beforeEach, afterEach,
} = require('mocha');
const sendgrid = require('./sendgrid');
const authenticate = require('./authenticate');

const mockgoose = new Mockgoose(mongoose);
const testUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Testy Test',
  type: 'individual',
  country: 'GB',
  termsSigned: true,
};

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiHttp);

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
  mongoose.connection.close();
  done();
});

describe('The sendgrid utility', () => {
  describe('sendEmail()', () => {
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
      mongoose.model('User').deleteMany({});
      done();
    });

    it('should be a function', () => {
      chai.expect(sendgrid.sendEmail).to.be.a('function');
    });

    it('should accept three arguments', () => {
      chai.expect(sendgrid.sendEmail.length).to.equal(3);
    });

    it('should successfully send an email with the correct template to the user', () => authenticate.registerUser(testUser).then(user => sendgrid.sendEmail(user, 'Test Email', 'confirm').then((msg) => {
      chai.expect(msg).to.be.a('object');
    })));

    it('should reject when the user does not exist', () => mongoose
      .model('User')
      .findByUsername(testUser.email)
      .then((user) => {
        chai.expect(sendgrid.sendEmail({ ...user, _id: 'fakeID' }, 'Test Email', 'force404')).to
          .be.rejected;
        chai
          .expect(sendgrid.sendEmail({ ...user, _id: 'fakeID' }, 'Test Email', 'force404'))
          .to.be.rejectedWith(Error);
        return user;
      })
      .then(user => sendgrid.sendEmail({ ...user, _id: 'fakeID' }, 'Test Email', 'force404').catch((err) => {
        chai.expect(err.message).to.equal('There was an issue sending the email');
      })));

    it('should reject when there is an issue with sendgrid', () => authenticate
      .registerUser({ ...testUser, email: 'will@fail.com' })
      .then((user) => {
        chai.expect(sendgrid.sendEmail(user, 'Test Email', 'confirm')).to.be.rejected;
        chai.expect(sendgrid.sendEmail(user, 'Test Email', 'confirm')).to.be.rejectedWith(Error);
        return user;
      })
      .then(user => sendgrid.sendEmail(user, 'Test Email', 'confirm').catch((err) => {
        chai.expect(err.message).to.equal('Something failed with sendgid');
      })));
  });
});
