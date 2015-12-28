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
const Event = eventSauce.Event;
const chai = require('chai');
const expect = chai.expect;

describe('Event (Basic Operations)', () => {
  describe('Construction should', () => {
    it('Succeed with correct inputs', () => {
      // Arrange

      // Act
      const instance = new Event('someType', {
        someValue: true,
      });

      // Assert
      expect(instance.eventType).to.equal('someType');
      expect(instance.eventData).deep.equal({
        someValue: true,
      });
    });

    it('Not succeed with bad event type name', () => {
      // Arrange

      // Act
      expect(function failure() {
        return new Event(null, {
          someValue: true,
        });
      }).to.throw(Error);
    });


    it('Should succeed with null event data', () => {
      // Arrange

      // Act
      const instance = new Event('someType', null);
      expect(instance.eventData).deep.equal({});
    });
  });
});
