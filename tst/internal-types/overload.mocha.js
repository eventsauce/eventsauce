/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
/* global beforeEach */
/* global describe */
/* global it */
const overload = require('../../lib/overload');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
chai.use(dirtyChai);

describe('Overload Helper', () => {
  describe('Input Testing', () => {
    it('Should match simple list', () => {
      expect(overload.match(
        ['hello', 1234],
        ['string', 'number']
      ), 'Basic test').to.equal(true);
    });

    it('Should match function descriptor in list', () => {
      expect(overload.match(
        ['hello', 1234],
        ['string', (input) => {
          return input === 1234;
        }]
      ), 'Function match test').to.equal(true);
    });

    it('Should match function descriptor in list', () => {
      expect(overload.match(
        ['hello', 1234],
        ['string', (input) => {
          return input !== 1234;
        }]
      ), 'Function reject test').to.equal(false);
    });

    it('Should mismatch complex list', () => {
      expect(overload.match(
        [1234, 'hello'],
        ['string', 'function', 'string']
      ), 'Rejetion test 1').to.equal(false);
    });

    it('Should mismatch complex list', () => {
      expect(overload.match(
        ['hello', () => { return false; }, 1234],
        ['string', 'function', 'string']
      ), 'Rejetion test 2').to.equal(false);
    });

    it('Should deep match argument in list', () => {
      expect(overload.match(
        ['hello', {
          foo: 'hello',
          bar: 1234,
        }, 1234],
        ['string', {
          foo: 'string',
          bar: 'number',
        }, 'number']
      ), 'Deep match test 1').to.equal(true);
    });

    it('Should deep reject argument in list', () => {
      expect(overload.match(
        ['hello', {
          foo: 'hello',
          bar: 1234,
        }, 1234],
        ['string', {
          foo: 'string',
          bar: 'function',    // WRONG
        }, 'number']
      ), 'Deep mismatch test 1').to.equal(false);
    });

    it('Should accept null typemap with any arguments', () => {
      expect(overload.match(['foo', 'bar'], null)).to.equal(true);
    });

    it('Should reject null value with any typemap', () => {
      expect(overload.match(['foo', null], ['string', 'string'])).to.equal(false);
    });
    it('Should accept any value with a null in typemap', () => {
      expect(overload.match(['foo', 1234], ['string', null]), 'Test 1').to.equal(true);
      expect(overload.match(['foo', 'bar'], ['string', null]), 'Test 2').to.equal(true);
      expect(overload.match(['foo', {}], ['string', null]), 'Test 3').to.equal(true);
    });

    it('Should exception on null arguments list', () => {
      expect(() => {
        overload.match(null, ['string']);
      }).to.throw(Error);
    });

    it('Should exception on bad descriptor type', () => {
      expect(() => {
        overload.match([1234], [1337]);
      }).to.throw(Error);
    });
  });
});
