/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const AggregateEvent = require('./aggregate-event');

/**
 * The JournalEntry is an an event being broadcast via an event stream.
 * It contains the context of the source aggregate type, key, sequence
 * number and the event itself.
 */
class JournalEntry {

  /**
   * Initialize a new JournalEntry
   * @param {Object}          input       - Input object (with aggregateType, aggregateKey, revision and event)
   */
  constructor(input) {
    if (!input.aggregateType || typeof input.aggregateType !== 'string') {
      throw new Error('Cannot create JournalEntry: input.aggregateType must be a non-null string');
    } else if (!input.aggregateKey || typeof input.aggregateKey !== 'string') {
      throw new Error('Cannot create JournalEntry: input.aggregateKey must be a non-null string');
    } else if (input.revision < 0 || typeof input.revision !== 'number') {
      throw new Error('Cannot create JournalEntry: input.revision must be number >= 0');
    } else if (!input.event || !(input.event instanceof AggregateEvent)) {
      throw new Error('Cannot create JournalEntry: input.event must be non-null and instance of [eventsauce].AggregateEvent');
    }
    // Build instance
    this._aggregateType = input.aggregateType;
    this._aggregateKey = input.aggregateKey;
    this._revision = input.revision;
    this._event = input.event;
  }

  /**
   * Aggregate type
   */
  get aggregateType() {
    return this._aggregateType;
  }

  /**
   * Aggregate key
   */
  get aggregateKey() {
    return this._aggregateKey;
  }

  /**
   * Aggregate revision the event relates to. This is the sequence number
   * of the aggregate _prior_ to the event.
   */
  get revision() {
    return this._revision;
  }

  /**
   * The event being journalled
   * @returns {Event}       Event instance
   */
  get event() {
    return this._event;
  }

  /**
   * Convert to a simple object representation for storage.
   */
  toObject() {
    return {
      aggregateType: this.aggregateType,
      aggregateKey: this.aggregateKey,
      revision: this.revision,
      event: this.event,
    };
  }
}

module.exports = JournalEntry;
