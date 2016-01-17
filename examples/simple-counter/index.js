'use strict';

const eventSauce = require('../../lib'); // use require('eventsauce') for real-world.

// Define our domain
const CounterAggregate = eventSauce.simple.makeAggregateType('CounterAggregate');
const CounterIncrementEvent = eventSauce.simple.makeEventType('CounterIncrementEvent');
const context = new eventSauce.BoundedContext();
context.defineEvent(CounterIncrementEvent.eventType, CounterIncrementEvent.fromObject);

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

// Create our domain-factory
const factory = new eventSauce.AggregateFactory(new eventSauce.MemoryRepository(context), () => new CounterAggregate());

// Load our aggregate over and over, changing it's state and commiting back implicitly
// at the end of the the withAggregate
const dummyKey = 'dummy-key';
let promiseChain = Promise.resolve(true);
for (let x = 0; x < 500; x++) {
  promiseChain = promiseChain.then(() => {
    return factory.withAggregate(dummyKey, (agg) => {
      console.log('Applying event to aggregate. Previous ticks: ' + agg.currentState.tickCount);
      agg.tick();
    });
  });
}

promiseChain.then((agg) => {
  console.log(agg);
});