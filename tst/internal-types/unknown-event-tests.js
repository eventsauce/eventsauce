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
const UnknownEvent = require('../../lib/unknown-event');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
chai.use(dirtyChai);

describe('UnknownEvent', () => {
  describe('Construction', () => {
    it('Should succeed with correct inputs', () => {
      // Arrange

      // Act
      const instance = new UnknownEvent('someEvent', {
        tick: 'tock',
      });

      // Assert
      expect(instance.eventType).to.equal('someEvent');
      expect(instance.eventData.tick).to.equal('tock');
    });
    it('Should fail without eventType', () => {
      expect(() => {
        return new UnknownEvent(null, {
          tick: 'tock',
        });
      }).to.throw(Error);
    });
    it('Should fail with non-string eventType', () => {
      expect(() => {
        return new UnknownEvent(1234, {
          tick: 'tock',
        });
      }).to.throw(Error);
    });
    it('Should fail with empty-string eventType', () => {
      expect(() => {
        return new UnknownEvent('    ', {
          tick: 'tock',
        });
      }).to.throw(Error);
    });
    it('Should fail without eventData', () => {
      expect(() => {
        return new UnknownEvent('someEvent', null);
      }).to.throw(Error);
    });
  });

  describe('Operations', () => {
    describe('instance.toObject', () => {
      let instance = null;
      beforeEach(() => {
        instance = new UnknownEvent('someEvent', {
          tick: 'tock',
        });
      });

      it('Should exist', () => {
        expect(instance.toObject).to.exist();
      });
      it('Should return correct object', () => {
        expect(instance.toObject().tick).to.equal('tock');
      });
    });
  });
});
