/* global forEach */
/* global forEach */
/* global forEach */
/* global forEach */
/* global forEach */
'use strict';

const Aggregate = require('./aggregate');
const AggregateEvent = require('./aggregate-event');
const validationHelpers = require('./validation-helpers');

/**
 * SimpleSauce is a helper class that defines various
 */
class SimpleSauce {

  /**
   * Create a new Aggregate type
   */
  makeAggregateType() {
    class GeneratedState {
    }

    class GeneratedAggregate extends Aggregate {
      constructor(key, snapshot) {
        super(key, snapshot);
      }
      createStateObject() {
        return new GeneratedState();
      }
    }

    // Set up an event replay wireup handler to simplify code
    GeneratedAggregate.stateReplay = function replayEventWireup(eventType, cb) {
      // Parse the event type name from the event type (or as a string)
      const eventTypeName = (typeof eventType === 'string') ? eventType : eventType.eventType;
      const validatedName = validationHelpers.capitalizeFirstLetter(eventTypeName);
      const methodName = 'on' + validatedName;

      // Wireup method on state object.
      GeneratedState.prototype[methodName] = cb;
    };

    return GeneratedAggregate;
  }

  /**
   * Define a new event type with the standard boilerplate attributes expected.
   */
  makeEventType(eventName) {
    class GeneratedEvent extends AggregateEvent {
      constructor() {
        super();
      }
      get eventType() {
        return eventName;
      }
      static fromObject(obj) {
        const instance = new GeneratedEvent();
        Object.keys(obj).forEach((key) => {
          instance[key] = obj[key];
        });
        return instance;
      }
      toObject() {
        return JSON.parse(JSON.stringify(this));
      }
    }

    // Static member
    GeneratedEvent.eventType = eventName;
    return GeneratedEvent;
  }
}

// We export a singleton for this module.
module.exports = new SimpleSauce();
