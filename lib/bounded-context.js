/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const debug = require('debug')('eventsauce:BoundedContext');
const sprintf = require('sprintf-js').sprintf;
const UnknownEvent = require('./unknown-event');
const validation = require('./validation-helpers');

/**
 * The BoundedContext is a collection of meta-data about a domain, such as event
 * definitions that allows agents operating against the domain to parse and understand
 * events. This is where handlers for parsing JSON event data and other constructs
 * are brought together.
 *
 * It is recommended that BoundedContext is subclassed in order to create a consistent
 * domain-specific map that can be re-used throughout your application
 */
class BoundedContext {

  /**
   * Initialize the BoundedContext instance
   */
  constructor() {
    this._eventParsers = {};
  }

  /**
   * Normalize a key for lookup into a dictionary
   * @param {String}      key               - Input key
   * @returns {String}                      - Lowercase string, trimmed
   */
  _normalizeKey(key) {
    return key.toLowerCase().trim();
  }

  /**
   * Define an event for this bounded context. The parserFunc passed must accept a single parameter
   * of type Object and return a suitable parsed AggregateEvent. Multiple definitions for same event
   * will overwrite the handler.
   *
   * @param {String}      eventType         - Event type to define
   * @param {Function}    parserFunc        - Function that takes object and returns AggregateEvent
   */
  defineEvent(eventType, parserFunc) {
    debug(sprintf('Defining event %s for context', eventType));
    if (!eventType || typeof eventType !== 'string' || validation.isNullOrWhitespace(eventType)) {
      throw new Error('Cannot defineEvent: eventType must be a non-null string');
    } else if (!parserFunc || !validation.isFunction(parserFunc)) {
      throw new Error('Cannot defineEvent: parserFunc must be a non-null function');
    }

    const key = this._normalizeKey(eventType);
    this._eventParsers[key] = parserFunc;
  }

  /**
   * Parse an event into a structured AggregateEvent from it's raw object format.
   *
   * @param {String}      eventType         - Type name of event.
   * @param {Object}      eventData         - Object containing serialized event
   * @returns {AggregateEvent}              - Parsed AggregateEvent type.
   */
  parseEvent(eventType, eventData) {
    debug(sprintf('Parsing event %s for context', eventType));
    if (!eventType || typeof eventType !== 'string' || validation.isNullOrWhitespace(eventType)) {
      throw new Error('Cannot parseEvent: eventType must be a non-null string');
    } else if (!eventData) {
      throw new Error('Cannot parseEvent: eventData cannot be null');
    }

    const key = this._normalizeKey(eventType);
    if (this._eventParsers[key]) {
      debug('We have a mapped handler, running parser');
      return this._eventParsers[key](eventData);
    }

    debug('Unknown event, defaulting to UnknownEvent type');
    return new UnknownEvent(eventType, eventData);
  }
}

module.exports = BoundedContext;
