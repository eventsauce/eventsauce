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
const BoundedContext = eventSauce.BoundedContext;
const CreatedEvent = require('../example-domain/created-event');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
chai.use(dirtyChai);

describe('BoundedContext', () => {
  describe('Construction', () => {
    it('Should succeed without parameters', () => {
      return new BoundedContext();
    });
  });

  describe('Operations', () => {
    let instance = null;
    beforeEach(() => {
      instance = new BoundedContext();
    });

    describe('defineEvent', () => {
      it('Should fail without eventType', () => {
        expect(() => {
          instance.defineEvent(null, CreatedEvent.fromObject);
        }).to.throw(Error);
      });
      it('Should fail without non-string eventType', () => {
        expect(() => {
          instance.defineEvent({}, CreatedEvent.fromObject);
        }).to.throw(Error);
      });
      it('Should fail with null parserFunc', () => {
        expect(() => {
          instance.defineEvent('created', null);
        }).to.throw(Error);
      });
      it('Should fail with non-func parserFunc', () => {
        expect(() => {
          instance.defineEvent('created', 'not-function');
        }).to.throw(Error);
      });
    });

    describe('parseEvent', () => {
      beforeEach(() => {
        instance.defineEvent('created', CreatedEvent.fromObject);
      });
      it('Should parse mapped eventType', () => {
        expect(instance.parseEvent('created', {
          time: Date.now(),
        })).to.be.an.instanceof(CreatedEvent);
      });
      it('Should parse unmapped eventType', () => {
        expect(instance.parseEvent('notMapped', {
          time: Date.now(),
        })).to.be.an.instanceof(AggregateEvent);
      });
      it('Should fail without eventType', () => {
        expect(() => {
          return instance.parseEvent(null, {
            time: Date.now(),
          });
        }).to.throw(Error);
      });
      it('Should fail non-string eventType', () => {
        expect(() => {
          instance.parseEvent(1234, {
            time: Date.now(),
          });
        }).to.throw(Error);
      });
      it('Should fail with empty eventType', () => {
        expect(() => {
          instance.parseEvent(' ', {
            time: Date.now(),
          });
        }).to.throw(Error);
      });
      it('Should fail without eventData', () => {
        expect(() => {
          return instance.parseEvent('created', null);
        }).to.throw(Error);
      });
    });
  });
});
