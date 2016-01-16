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
const eventSauce = require('../../lib');
const AggregateEvent = eventSauce.AggregateEvent;
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
chai.use(dirtyChai);

describe('AggregateEvent', () => {
  describe('Construction', () => {
    it('Should succeed with no inputs', () => {
      // Arrange

      // Act
      const instance = new AggregateEvent();

      // Assert
      expect(instance.toObject).to.exist();
    });
  });

  describe('Operations', () => {
    describe('prototype.fromObject', () => {
      it('Should exist', () => {
        expect(AggregateEvent.fromObject).to.exist();
      });
      it('Should throw exception since abstract', () => {
        expect(() => {
          AggregateEvent.fromObject({});
        }).to.throw(Error);
      });
    });
    describe('instance.eventType', () => {
      let instance = null;
      beforeEach(() => {
        instance = new AggregateEvent();
      });
      it('Should return AggregateEvent', () => {
        expect(instance.eventType).to.equal('AggregateEvent');
      });
      it('Should return correct type on subclassing', () => {
        class SubEventType extends AggregateEvent {
          constructor() {
            super();
          }
        }
        const subType = new SubEventType();
        expect(subType.eventType).to.equal('SubEventType');
      });
    });
    describe('instance.toObject', () => {
      let instance = null;
      beforeEach(() => {
        instance = new AggregateEvent();
      });

      it('Should exist', () => {
        expect(instance.toObject).to.exist();
      });
      it('Should throw exception since abstract', () => {
        expect(() => {
          return instance.toObject();
        }).to.throw(Error);
      });
    });
  });
});
