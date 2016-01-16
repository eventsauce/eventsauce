/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * Describes an event for an aggregate. Events should have a .toObject() method and a static
 * .fromObject() method that allows easy serialization and deserialization. Should not be used
 * directly.
 **/
class AggregateEvent {

  /**
   * Initialize a new instance of the AggregateEvent.
   **/
  constructor() {
    // Intentionally blank
  }

  /**
   * Get the event type of this event.
   * @returns {String}                    - Name of event type.
   **/
  get eventType() {
    return this.constructor.name;
  }

  /**
   * Parse the event from an object definition.
   * @param {Object} object               - Object to parse
   * @returns {AggregateEvent}            - Parsed event
   */
  static fromObject(object) {
    throw new Error('fromObject must be overriden in each AggregateEvent definition: ' + object);
  }

  /**
   * Convert the current instance to an object
   * @returns {Object}                    - Object for serialization
   */
  toObject() {
    throw new Error('toObject has not been overriden in this aggregate definition');
  }
}

module.exports = AggregateEvent;
