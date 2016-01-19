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
const AggregateFactory = eventSauce.AggregateFactory;
const BoundedContext = eventSauce.BoundedContext;
const MemoryRepository = eventSauce.MemoryRepository;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('AggregateFactory', () => {
  describe('Construction', () => {
    it('Should succeed with correct parameters', () => {
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      const instance = new AggregateFactory(repo, () => {
        return new AggregateType();
      });
      instance.toString();
    });

    it('Should fail without repository parameter', () => {
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      expect(() => {
        const instance = new AggregateFactory(null, () => {
          return new AggregateType();
        });
        instance.toString();
      }).to.throw(Error);
    });

    it('Should fail without generator parameter', () => {
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      expect(() => {
        const instance = new AggregateFactory(repo, null);
        instance.toString();
      }).to.throw(Error);
    });
  });

  describe('Basic Behaviours', () => {
    it('Should load and run aggregate callbacks', () => {
      // Arrange
      let ticks = 0;
      let theAgg = null;
      const TickEvent = eventSauce.simple.makeEventType('TickEvent');
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      AggregateType.stateReplay(TickEvent, function runEvent(event) {
        this.tickCount = (this.tickCount || 0) + 1;
        this.lastMessage = event.message;
      });
      AggregateType.prototype.tick = function runTickCommand() {
        this.applyEvent(TickEvent.fromObject({
          lastMessage: 'Tick ' + ticks,
        }));
        ticks = ticks + 1;
      };
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      const factory = new AggregateFactory(repo, () => {
        return new AggregateType();
      });

      // Act
      return factory.withAggregate('some-key', (agg) => {
        agg.tick();
        theAgg = agg;
      }).then(() => {
        expect(ticks).to.equal(1);
        expect(theAgg.currentState.tickCount).to.equal(1);
        expect(theAgg.pendingEvents.length).to.equal(0);
        return Promise.resolve();
      });
    });

    it('Should return rejection when exception in aggregate callbacks', () => {
      // Arrange
      let ticks = 0;
      let theAgg = null;
      const TickEvent = eventSauce.simple.makeEventType('TickEvent');
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      AggregateType.stateReplay(TickEvent, function runEvent(event) {
        this.tickCount = (this.tickCount || 0) + 1;
        this.lastMessage = event.message;
      });
      AggregateType.prototype.tick = function runTickCommand() {
        this.applyEvent(TickEvent.fromObject({
          lastMessage: 'Tick ' + ticks,
        }));
        ticks = ticks + 1;
      };
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      const factory = new AggregateFactory(repo, () => {
        return new AggregateType();
      });

      // Act
      return expect(factory.withAggregate('some-key', (agg) => {
        agg.tick();
        theAgg = agg;
        throw new Error('Fail');
      }).catch(() => {
        // Expect we never committed
        expect(theAgg.pendingEvents.length).to.equal(1);
        return 'success';
      })).to.eventually.deep.equal('success');
    });

    it('Should be able to reload stored aggregate after withAggrgate', () => {
      // Arrange
      let ticks = 0;
      let theAgg = null;
      const eventsToApply = 50;
      const TickEvent = eventSauce.simple.makeEventType('TickEvent');
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      AggregateType.stateReplay(TickEvent, function runEvent(event) {
        this.tickCount = (this.tickCount || 0) + 1;
        this.lastMessage = event.message;
      });
      AggregateType.prototype.tick = function runTickCommand() {
        this.applyEvent(TickEvent.fromObject({
          lastMessage: 'Tick ' + ticks,
        }));
        ticks = ticks + 1;
      };
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      const factory = new AggregateFactory(repo, () => {
        return new AggregateType();
      });
      const originalCreation = factory.withAggregate('some-key', (agg) => {
        for (let x = 0; x < eventsToApply; x++) {
          agg.tick();
        }
        theAgg = agg;
      });

      // Act
      return originalCreation.then(() => {
        return factory.withAggregate('some-key', (agg) => {
          expect(agg.revisionNumber).to.equal(eventsToApply);
          expect(theAgg.pendingEvents.length).to.equal(0);
          return Promise.resolve();
        });
      });
    });

    it('Should be able to reload stored aggregate with multi-fetch', () => {
      // Arrange
      let ticks = 0;
      let theAgg = null;
      const eventsToApply = 503;
      const fetchSize = 37;
      const TickEvent = eventSauce.simple.makeEventType('TickEvent');
      const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
      AggregateType.stateReplay(TickEvent, function runEvent(event) {
        this.tickCount = (this.tickCount || 0) + 1;
        this.lastMessage = event.message;
      });
      AggregateType.prototype.tick = function runTickCommand() {
        this.applyEvent(TickEvent.fromObject({
          lastMessage: 'Tick ' + ticks,
        }));
        ticks = ticks + 1;
      };
      const context = new BoundedContext();
      const repo = new MemoryRepository(context);
      const factory = new AggregateFactory(repo, () => {
        return new AggregateType();
      }, {
        fetchSize,
      });
      const originalCreation = factory.withAggregate('some-key', (agg) => {
        for (let x = 0; x < eventsToApply; x++) {
          agg.tick();
        }
        theAgg = agg;
      });

      // Act
      return originalCreation.then(() => {
        return factory.withAggregate('some-key', (agg) => {
          expect(agg.revisionNumber).to.equal(eventsToApply);
          expect(theAgg.pendingEvents.length).to.equal(0);
          return Promise.resolve();
        });
      });
    });
  });

  describe('Input Validation', () => {
    describe('withAggregate', () => {
      it('Should fail with null key', () => {
        // Arrange
        const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
        const context = new BoundedContext();
        const repo = new MemoryRepository(context);
        const instance = new AggregateFactory(repo, () => {
          return new AggregateType();
        });

        // Act
        expect(() => {
          instance.withAggregate(null, () => {
            // Intentionally bank
          });
        }).to.throw(Error);
      });

      it('Should fail with null callback', () => {
        // Arrange
        const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
        const context = new BoundedContext();
        const repo = new MemoryRepository(context);
        const instance = new AggregateFactory(repo, () => {
          return new AggregateType();
        });

        // Act
        expect(() => {
          instance.withAggregate('some-key', null);
        }).to.throw(Error);
      });

      it('Should fail with non-func callback', () => {
        // Arrange
        const AggregateType = eventSauce.simple.makeAggregateType('TestAggregate');
        const context = new BoundedContext();
        const repo = new MemoryRepository(context);
        const instance = new AggregateFactory(repo, () => {
          return new AggregateType();
        });

        // Act
        expect(() => {
          instance.withAggregate('some-key', '1234');
        }).to.throw(Error);
      });
    });
  });
});
