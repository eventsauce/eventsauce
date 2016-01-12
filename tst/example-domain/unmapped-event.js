/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const eventSauce = require('../../lib');
const AggregateEvent = eventSauce.AggregateEvent;

/**
 * UnmappedEvent is a simple event that helps us test some domain in the core.
 * It is purposefuly not registered with ExampleContext
 */
class UnmappedEvent extends AggregateEvent {

  /**
   * Initialize a new instance of the event.
   */
  constructor(input) {
    super();

    if (input) {
      this._sequence = input.sequence || 0;
    }
  }

  /**
   * Sequence number
   */
  get sequence() {
    return this._sequence;
  }

  /**
   * Get the event type of this event.
   * @returns {String}                    - Name of event type.
   **/
  getEventType() {
    return 'UnmappedEvent';
  }
  /**
   * Parse the event from an object definition.
   * @param {Object} object               - Object to parse
   * @returns {AggregateEvent}            - Parsed event
   */
  static fromObject(object) {
    return new UnmappedEvent(object);
  }

  /**
   * Convert the current instance to an object
   * @returns {Object}                    - Object for serialization
   */
  toObject() {
    return {
      sequence: this._sequence,
    };
  }
}

module.exports = UnmappedEvent;
