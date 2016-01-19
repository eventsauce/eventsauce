/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
/* global describe */
/* global it */
const eventSauce = require('../../lib');
const UnknownEvent = require('../../lib/unknown-event');
const JournalEntry = eventSauce.JournalEntry;
const chai = require('chai');
const expect = chai.expect;

describe('JournalEntry', () => {
  describe('Construction', () => {
    const event = new UnknownEvent('some-event', { foo: 5678 });
    const input = {
      aggregateType: 'some-agg',
      aggregateKey: 'some-key',
      revision: 1234,
      eventType: event.eventType,
      eventData: event.toObject(),
    };

    it('Should succeed with correct inputs', () => {
      // Act
      const instance = new JournalEntry(input);

      // Assert
      expect(instance.toObject()).to.deep.equal(input);
    });

    it('Should fail if any property is missing', () => {
      Object.keys(input).forEach((key) => {
        const clone = JSON.parse(JSON.stringify(input));
        delete clone[key];
        expect(() => {
          return new JournalEntry(clone);
        }).to.throw(Error);
      });
    });
  });
});
