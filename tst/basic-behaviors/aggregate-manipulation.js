/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
/* global describe */
/* global it */
const domain = require('../example-domain');
const ExampleAggregateRoot = domain.ExampleAggregateRoot;
const TimeKeeper = domain.ExampleService;
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

describe('Aggregate', () => {
  const dummyKey = 'dummy-aggregate-key';

  describe('Construction', () => {
    it('Able to be constructed.', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();

      // Act
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Assert
      should.exist(instance);
      expect(instance.pendingEvents).to.have.length(0);
    });
  });

  describe('Domain logic for ExampleAggregateRoot', () => {
    it('Succeed when creating instance once', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      instance.create();

      // Assert
      expect(instance.pendingEvents).to.have.length(1);
    });

    it('Throw when calling create() operation twice', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      instance.create();
      expect(instance.create).to.throw(Error);

      // Assert
      expect(instance.pendingEvents).to.have.length(1);
    });


    it('Throw when applying undefined state-object event.', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      instance.create();
      instance.tick();
      expect(function runTock() {
        instance.tock();
      }).to.throw(Error);

      // Assert
      expect(instance.pendingEvents).to.have.length(2);
    });
  });

  describe('State management', () => {
    it('Should not permit null applyEvent', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      expect(() => {
        instance.applyEvent(null);
      }).to.throw(Error);
    });

    it('Should not permit non-AggregateEvent applyEvent', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      expect(() => {
        instance.applyEvent({
          foo: 'bar',
        });
      }).to.throw(Error);
    });

    it('currentState should return the state object', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      const state = instance.currentState;

      // Assert
      should.exist(state);
    });

    it('Revision number should only move after commitState()', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act / Assert: Part 1
      instance.create();
      expect(instance.pendingEvents).to.have.length(1);
      expect(instance.revisionNumber).to.equal(0);

      // Act / Assert: Part 2
      instance.commitState();
      expect(instance.pendingEvents).to.have.length(0);
      expect(instance.revisionNumber).to.equal(1);
    });
  });

  describe('Replaying', () => {
    it('Should be able to replay basic event sequence', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);
      instance.create();
      instance.tick();
      instance.tick();

      // Act
      const eventStream = instance.pendingEvents;
      const newAggregate = new ExampleAggregateRoot(dummyKey, instance);
      newAggregate.replayEventStream(eventStream);

      // Assert
      expect(newAggregate.revisionNumber).to.equal(3);
      expect(newAggregate.totalTicks).to.equal(2);
    });

    it('Should fail to replay null or empty stream', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act / Assert
      expect(function withNull() {
        return instance.replayEventStream(null);
      }).to.throw(Error);
      expect(function withNonList() {
        return instance.replayEventStream({});
      }).to.throw(Error);
    });
  });

  describe('Snapshotting', () => {
    it('Cannot create snapshot at revision 0', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act / Assert
      expect(instance.generateSnapshot).to.throw(Error);
    });

    it('Can create snapshot at revision 1', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const mockTime = new Date(1984, 12, 6, 5, 4, 3, 2, 1).getTime();
      timeKeeper.getTime = function getTimeMock() {
        return mockTime;
      };
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      instance.create();
      instance.commitState();
      const snapshot = instance.generateSnapshot();

      // Assert
      expect(snapshot.revisionNumber).to.equal(1);
      expect(snapshot.state).deep.equals({
        _createdTime: mockTime,
        _created: true,
        _tickCount: 0,
      });
    });

    it('Can reload from self-snapshot', () => {
      // Arrange
      const timeKeeper = new TimeKeeper();
      const mockTime = new Date(1984, 12, 6, 5, 4, 3, 2, 1).getTime();
      timeKeeper.getTime = function getTimeMock() {
        return mockTime;
      };
      const instance = new ExampleAggregateRoot(dummyKey, timeKeeper);

      // Act
      instance.create();
      instance.tick();
      instance.commitState();
      const snapshot = instance.generateSnapshot();
      const newInstance = new ExampleAggregateRoot(dummyKey, timeKeeper, snapshot);
      const newSnapshot = newInstance.generateSnapshot();

      // Assert
      expect(newSnapshot.revisionNumber).to.equal(2);
      expect(newSnapshot).deep.equals(snapshot);
    });
  });
});
