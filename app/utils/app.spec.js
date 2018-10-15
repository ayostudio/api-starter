const { expect, use } = require('chai');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const sinonChai = require('sinon-chai');
const {
  describe, it, before, after, afterEach,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const app = require('./app');
const config = require('../config');

const mockgoose = new Mockgoose(mongoose);
const testApp = {
  name: 'Test App',
  description: 'This is a sample test app.',
  userId: 'testuser',
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

describe('The app utility', () => {
  describe('createApp()', () => {
    afterEach(() => mongoose.model('App').deleteMany({}));

    it('should be a function', () => {
      expect(app.createApp).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(app.createApp.length).to.equal(1);
    });

    it('should successfully create a new app when passed a valid user object', () => app.createApp(testApp).then((storedApp) => {
      expect(storedApp._doc).to.be.an('object');
      expect(storedApp._doc).to.have.all.keys([
        '_id',
        'name',
        'description',
        'testSecret',
        'testPublic',
        'liveSecret',
        'livePublic',
        'createdAt',
        'updatedAt',
        'userId',
        '__v',
      ]);
    }));

    it('should return an error when passed a app object with invalid name', () => {
      const invalidApp = { ...testApp, name: null };
      expect(app.createApp(invalidApp)).to.be.rejected;
      expect(app.createApp(invalidApp)).to.be.rejectedWith(Error);
      return app.createApp(invalidApp).catch((err) => {
        expect(err.name).to.equal('ValidationError');
      });
    });

    it('should return an error when passed a user object with invalid description', () => {
      const invalidApp = {
        ...testApp,
        description: null,
      };

      expect(app.createApp(invalidApp)).to.be.rejected;
      expect(app.createApp(invalidApp)).to.be.rejectedWith(Error);
      return app.createApp(invalidApp).catch((err) => {
        expect(err.name).to.equal('ValidationError');
      });
    });
  });

  describe('createAppKeys()', () => {
    it('should be a function', () => {
      expect(app.createAppKeys).to.be.a('function');
    });

    it('should successfully create app keys when passing an enviroment', () => app.createAppKeys('test').then((keys) => {
      expect(keys).to.be.an('object');
      expect(keys).to.have.all.keys(['public', 'secret']);
    }));

    it('should return an error when have not passed an enviroment', () => {
      expect(app.createAppKeys()).to.be.rejected;
      expect(app.createAppKeys()).to.be.rejectedWith(Error);
      return app.createAppKeys().catch((err) => {
        expect(err.name).to.equal('Error');
      });
    });
  });

  describe('collectApp()', () => {
    afterEach(() => mongoose.model('App').deleteMany({}));

    it('should be a function', () => {
      expect(app.collectApp).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(app.collectApp.length).to.equal(1);
    });

    it('should successfully collect an app when giving a valid app key', () => app
      .createApp(testApp)
      .then(storedApp => app.collectApp(storedApp.livePublic))
      .then((collectedApp) => {
        expect(collectedApp._doc).to.be.an('object');
        expect(collectedApp._doc).to.have.all.keys([
          '_id',
          'name',
          'description',
          'testSecret',
          'testPublic',
          'liveSecret',
          'livePublic',
          'createdAt',
          'updatedAt',
          'userId',
          '__v',
        ]);
      }));

    it('should successfully collect an app when giving a valid test app key', () => app
      .createApp(testApp)
      .then(storedApp => app.collectApp(storedApp.testPublic))
      .then((collectedApp) => {
        expect(collectedApp._doc).to.be.an('object');
        expect(collectedApp.isTest).to.equal(true);
        expect(collectedApp._doc).to.have.all.keys([
          '_id',
          'name',
          'description',
          'testSecret',
          'testPublic',
          'liveSecret',
          'livePublic',
          'createdAt',
          'updatedAt',
          'userId',
          '__v',
        ]);
      }));

    it('should return an error when passed a invalid key', () => {
      expect(app.collectApp('fakeKey')).to.be.rejected;
      expect(app.collectApp('fakeKey')).to.be.rejectedWith(Error);
      return app.collectApp('fakeKey').catch((err) => {
        expect(err.name).to.equal('Error');
      });
    });

    it('should return an error when there was an error in mongoose', () => {
      expect(app.collectApp({ something: 'what' })).to.be.rejected;
      expect(app.collectApp({ something: 'what' })).to.be.rejectedWith(Error);
      return app.collectApp({ something: 'what' }).catch((err) => {
        expect(err.name).to.equal('CastError');
      });
    });

    it('should return an error when passed no key', () => {
      expect(app.collectApp()).to.be.rejected;
      expect(app.collectApp()).to.be.rejectedWith(Error);
      return app.collectApp().catch((err) => {
        expect(err.name).to.equal('Error');
      });
    });
  });

  describe('getAppKeyFromReq()', () => {
    it('should be a function', () => {
      expect(app.getAppKeyFromReq).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(app.getAppKeyFromReq.length).to.equal(1);
    });

    it('should successfully collect an app key from request', () => {
      const appKey = app.getAppKeyFromReq({
        authedApp: {
          _doc: {
            liveSecret: 'testliveSecret',
            testSecret: 'testtestSecret',
          },
        },
      });

      expect(appKey).to.equal('testliveSecret');
    });

    it('should successfully collect an app test key from request which is a test', () => {
      const appKey = app.getAppKeyFromReq({
        authedApp: {
          _doc: {
            liveSecret: 'testliveSecret',
            testSecret: 'testtestSecret',
          },
          isTest: true,
        },
      });

      expect(appKey).to.equal('testtestSecret');
    });

    it('should successfully return the admin key if the requested app is admin', () => {
      const appKey = app.getAppKeyFromReq({
        authedApp: 'admin',
        query: {
          app: config.adminKey,
        },
      });
      expect(appKey).to.equal(config.adminKey);
    });

    it('should return not-authenticated if you supply no authed app', () => {
      const appKey = app.getAppKeyFromReq({
        authedApp: null,
      });
      expect(appKey).to.equal('not-authenticated');
    });
  });
});
