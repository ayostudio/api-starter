const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');
const { describe, it } = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const countries = require('./countries');

use(sinonChai);
use(chaiAsPromised);

describe('The countries utility', () => {
  describe('getSupportedCountriesArray()', () => {
    it('should be a function', () => {
      expect(countries.getSupportedCountriesArray).to.be.a('function');
    });

    it('should return an object containing supported countries', () => {
      expect(countries.getSupportedCountriesArray()).to.be.a('array');
    });
  });

  describe('getSupportedCountries()', () => {
    it('should be a function', () => {
      expect(countries.getSupportedCountries).to.be.a('function');
    });

    it('should return an object containing supported countries', () => {
      expect(countries.getSupportedCountries()).to.be.a('object');
    });
  });

  describe('getCountryCode()', () => {
    it('should be a function', () => {
      expect(countries.getCountryCode).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(countries.getCountryCode.length).to.equal(1);
    });

    it('should return the country code when passing a valid country', () => countries.getCountryCode('United Kingdom').then((countryCode) => {
      expect(countryCode).to.be.a('string');
      expect(countryCode).to.equal('GB');
    }));

    it('should return an error when passing a invalid country', () => {
      expect(countries.getCountryCode('Fake Country')).to.be.rejected;
      expect(countries.getCountryCode('Fake Country')).to.be.rejectedWith(Error);
      return countries.getCountryCode('Fake Country').catch((err) => {
        expect(err.message).to.equal('Unsupported country');
      });
    });
  });

  describe('getCurrencySymbol()', () => {
    it('should be a function', () => {
      expect(countries.getCurrencySymbol).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(countries.getCurrencySymbol.length).to.equal(1);
    });

    it('should return the currency symbol when passing a valid currency', () => countries.getCurrencySymbol('GBP').then((currency) => {
      expect(currency).to.be.a('string');
      expect(currency).to.equal('£');
    }));

    it('should return an error when passing a invalid currency', () => {
      expect(countries.getCurrencySymbol('FAKE')).to.be.rejected;
      expect(countries.getCurrencySymbol('FAKE')).to.be.rejectedWith(Error);
      return countries.getCurrencySymbol('FAKE').catch((err) => {
        expect(err.message).to.equal('Unsupported country');
      });
    });
  });

  describe('getCountryCurrency()', () => {
    it('should be a function', () => {
      expect(countries.getCountryCurrency).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(countries.getCountryCurrency.length).to.equal(1);
    });

    it('should return the country code when passing a valid country', () => countries.getCountryCurrency('United Kingdom').then((currency) => {
      expect(currency).to.be.a('string');
      expect(currency).to.equal('GBP');
    }));

    it('should return an error when passing a invalid country', () => {
      expect(countries.getCountryCurrency('Fake Country')).to.be.rejected;
      expect(countries.getCountryCurrency('Fake Country')).to.be.rejectedWith(Error);
      return countries.getCountryCurrency('Fake Country').catch((err) => {
        expect(err.message).to.equal('Unsupported country');
      });
    });
  });

  describe('getFiscalYear()', () => {
    it('should be a function', () => {
      expect(countries.getFiscalYear).to.be.a('function');
    });

    it('should accept one argument', () => {
      expect(countries.getFiscalYear.length).to.equal(1);
    });

    it('should return the country code when passing a valid country', () => countries.getFiscalYear('United Kingdom').then((fiscalYear) => {
      expect(fiscalYear).to.be.a('object');
    }));

    it('should return an error when passing a invalid country', () => {
      expect(countries.getFiscalYear('Fake Country')).to.be.rejected;
      expect(countries.getFiscalYear('Fake Country')).to.be.rejectedWith(Error);
      return countries.getFiscalYear('Fake Country').catch((err) => {
        expect(err.message).to.equal('Unsupported country');
      });
    });
  });
});
