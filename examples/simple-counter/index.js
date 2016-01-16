'use strict';

const eventSauce = require('../../lib'); // use require('eventsauce') for real-world.

const CounterIncrementEvent = eventSauce.simple.makeEventType('CounterIncrementEvent');
const CounterAggregate = eventSauce.simple.makeAggregateType('CounterAggregate');

/**
 * Replay handler for CounterIncrementEvent
 */
CounterAggregate.stateReplay(CounterIncrementEvent, function (event) {
  this.lastTick = event.requestTime;
  this.tickCount = (this.tickCount || 0) + 1;
});

/**
 * Methods on the aggregate manipulate the state
 */
CounterAggregate.prototype.tick = function() {
  this.applyEvent(CounterIncrementEvent.fromObject({
    requestTime: Date.now()
  }));
};

console.log('Tick Example');
const instance = new CounterAggregate();
for (let x = 0; x < 5; x++) {
  instance.tick();
}

console.log(JSON.stringify(instance.currentState));