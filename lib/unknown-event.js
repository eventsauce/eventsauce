/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const AggregateEvent = require('./aggregate-event');
const validation = require('./validation-helpers');

/**
 * The UnknownEvent is an event that is unknown or undefined for our context.
 * It stores enough information to pass around the event between components
 * who do not share an understanding of contracts.
 *
 * This AggregateEvent does not overide fromObject as we are not able to infer
 * aggregateType - so explicit construction is always required.
 */
class UnknownEvent extends AggregateEvent {

  /**
   * Initialize a new instance of UnknownEvent
   * @param {String}    eventType             - Event type name
   * @param {Object}    eventData             - Raw object/data for the event.
   */
  constructor(eventType, eventData) {
    super();
    if (!eventType || typeof eventType !== 'string' || validation.isNullOrWhitespace(eventType)) {
      throw new Error('Cannot create UnknownEvent: eventType must be a non-null string');
    } else if (!eventData) {
      throw new Error('Cannot create UnknownEvent: eventData cannot be null');
    }

    this._eventType = eventType;
    this._eventData = eventData;
  }

  /**
   * Event Type
   */
  get eventType() {
    return this._eventType;
  }

  /**
   * Event data
   */
  get eventData() {
    return this._eventData;
  }

  /**
   * Convert the payload of this to an object for storage.
   */
  toObject() {
    return this._eventData;
  }
}

module.exports = UnknownEvent;
