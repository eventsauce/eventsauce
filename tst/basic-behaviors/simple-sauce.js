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
const chai = require('chai');
const expect = chai.expect;

describe('SimpleSauce', () => {
  describe('Event Definitions', () => {
    const EventTypeDef = eventSauce.simple.makeEventType('fooEvent');
    const dummyPayload = {
      foo: 'key',
      bar: 5678,
      sub: {
        meta: 'tag',
        beef: 1337,
      },
    };

    it('Should be constructable', () => {
      const instance = new EventTypeDef();
      expect(instance.eventType).to.equal('fooEvent');
    });

    it('Should set keys appropriately', () => {
      const result = EventTypeDef.fromObject(dummyPayload);
      expect(result.eventType).to.equal('fooEvent');
      expect(result.toObject()).to.deep.equal(dummyPayload);
    });

    it('Should round-trip correctly', () => {
      const result = EventTypeDef.fromObject(dummyPayload);
      const json = JSON.parse(JSON.stringify(result));
      const loaded = EventTypeDef.fromObject(json);
      expect(loaded.eventType).to.equal('fooEvent');
      expect(loaded.toObject()).to.deep.equal(dummyPayload);
    });
  });

  describe('Sample Applications', () => {
    describe('Tick-Tock', () => {
      const CounterIncrementEvent = eventSauce.simple.makeEventType('CounterIncrementEvent');
      const CounterDecrementEvent = eventSauce.simple.makeEventType('CounterDecrementEvent');
      const CounterAggregate = eventSauce.simple.makeAggregateType('CounterAggregate');

      /**
       * Replay handler for CounterIncrementEvent
       */
      CounterAggregate.stateReplay(CounterIncrementEvent, function onCounterIncrementEvent(event) {
        this.lastTick = event.requestTime;
        this.tickCount = (this.tickCount || 0) + 1;
      });
      /**
       * Replay handler for CounterIncrementEvent
       */
      CounterAggregate.stateReplay('CounterDecrementEvent', function onCounterDecrementEvent(event) {
        this.lastTock = event.requestTime;
        this.tickCount = (this.tickCount || 0) - 1;
      });


      /**
       * Methods on the aggregate manipulate the state
       */
      CounterAggregate.prototype.tick = function tickCommand() {
        this.applyEvent(CounterIncrementEvent.fromObject({
          requestTime: Date.now(),
        }));
      };
      CounterAggregate.prototype.tock = function tickCommand() {
        this.applyEvent(CounterDecrementEvent.fromObject({
          requestTime: Date.now(),
        }));
      };

      it('Should be constructable', () => {
        const instance = new CounterAggregate();
        expect(instance.revisionNumber).to.equal(0);
      });

      it('Should be able to manipulate state', () => {
        const instance = new CounterAggregate();
        instance.tick();
        instance.tick();
        instance.tock();
        instance.tick();
        expect(instance.pendingEvents.length).to.equal(4);
        expect(instance.currentState.tickCount).to.equal(2);
      });
    });
  });
});
