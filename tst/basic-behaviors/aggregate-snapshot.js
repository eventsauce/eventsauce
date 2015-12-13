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
const AggregateSnapshot = eventSauce.AggregateSnapshot;
const chai = require('chai');
const expect = chai.expect;

describe('AggregateSnapshot (Basic Operations)', () => {
  describe('Construction should', () => {
    it('Succeed with correct inputs', () => {
      // Arrange

      // Act
      const instance = new AggregateSnapshot({
        someValue: true,
      }, 1);

      // Assert
      expect(instance.revisionNumber).to.equal(1);
      expect(instance.state).deep.equal({
        someValue: true,
      });
    });

    it('Not succeed with null state.', () => {
      // Arrange

      // Act
      expect(function failure() {
        return new AggregateSnapshot(null, 1);
      }).to.throw(Error);
    });

    it('Not succeed with revision 0.', () => {
      // Arrange

      // Act
      expect(function failure() {
        return new AggregateSnapshot({
          someValue: true,
        }, 0);
      }).to.throw(Error);
    });

    it('Not succeed with negative revision.', () => {
      // Arrange

      // Act
      expect(function failure() {
        return new AggregateSnapshot({
          someValue: true,
        }, -1234);
      }).to.throw(Error);
    });
  });
});
