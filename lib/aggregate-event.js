/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const validationHelpers = require('./validation-helpers');

/**
 * Describes an event for an aggregate
 **/
class AggregateEvent {
  /**
   * Initialize a new instance of the AggregateEvent.
   * @param eventType     {String}      Event type name
   * @param eventData     {Object}      Object data for event handling.
   **/
  constructor(eventType, eventData) {
    if (validationHelpers.isNullOrWhitespace(eventType)) {
      throw new Error('The eventType for a Event cannot have a name that is null or whitespace only.');
    }

    this._eventType = eventType;
    this._eventData = eventData || {};
  }

  /**
   * Get the event type of this event.
   * @returns {String}  Name of even type.
   **/
  get eventType() {
    return this._eventType;
  }

  /**
   * Get the event data for this event.
   * @returns {Object}    Event data.
   **/
  get eventData() {
    return this._eventData;
  }
}

module.exports = AggregateEvent;
