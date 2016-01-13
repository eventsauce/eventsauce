/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

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
    } if (!input.eventType || typeof input.eventType !== 'string') {
      throw new Error('Cannot create JournalEntry: input.eventType must be a non-null string');
    } if (!input.eventData || typeof input.eventData !== 'object') {
      throw new Error('Cannot create JournalEntry: input.eventData must be a non-null plain Object');
    }

    // Build instance
    this._aggregateType = input.aggregateType;
    this._aggregateKey = input.aggregateKey;
    this._revision = input.revision;
    this._eventType = input.eventType;
    this._eventData = input.eventData;
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
   * @returns {string}       Event Type
   */
  get eventType() {
    return this._eventType;
  }

  /**
   * The event data being journalled
   * @returns {Object}       Event body
   */
  get eventData() {
    return this._eventData;
  }


  /**
   * Convert to a simple object representation for storage.
   */
  toObject() {
    return {
      aggregateType: this.aggregateType,
      aggregateKey: this.aggregateKey,
      revision: this.revision,
      eventType: this.eventType,
      eventData: this.eventData,
    };
  }
}

module.exports = JournalEntry;
