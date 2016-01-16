/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const BoundedContext = require('./bounded-context');
const Repository = require('./repository');
const sprintf = require('sprintf-js').sprintf;
// const validation = require('./validation-helpers');

/**
 * The MemoryRepository is a simple in-memory repository of aggregates. It will keep consuming
 * memory until it is explicitly closed, at which point all data will be destroyed. It is intended
 * for use in test-cases, small semi-stateful applications and other scenarios for small amounts
 * of disposable data.
 *
 * @remarks
 *   Even through memory operations are instant, we still preserve the use of promises here. For
 * example input validation throws exceptions, but state and transition exceptions come back as
 * promise rejections. This is to act as-per providers that have latency, which will only be able
 * to make such indictations in a promise-ish way.
 **/
class MemoryRepository extends Repository {

  /**
   * Initialize a new instance of the MemoryRepository.
   * @param {BoundedContext}      context      - Bounded context
   **/
  constructor(context) {
    super();
    if (!context || !(context instanceof BoundedContext)) {
      throw new Error('Cannot initialize MemoryRepository: context must be BoundedContext');
    }
    this._keyToStreamMap = {};
  }

  /**
   * Get N number of events for an aggregate by key.
   *
   * @param key       {String}      Aggregate key to load event stream for.
   * @param initial   {Number}      Current event number of aggregate state (Default is 0/start of life.)
   * @param count     {Number}      Maximum number of events to return. Defaults to 1000.
   *
   * @returns         {Promise}     Promise that will yield the events in an array or an empty array.
   **/
  getEvents(key, initial, count) {
    // Validate arguments
    if (!key || typeof key !== 'string') {
      throw new Error('getEvents(key) requires a non-null string input.');
    }

    // Validate state
    if (!this._keyToStreamMap) {
      throw new Error('Cannot getEvents on a closed MemoryRepository');
    }
    const eventStart = initial || 0;
    const eventEnd = eventStart + (count && count > 0 ? count : 1000);

    // If we have events, apply them.
    let result = null;

    if (this._keyToStreamMap[key]) {
      const stream = this._keyToStreamMap[key];
      result = stream.slice(eventStart, eventEnd);
    } else if (eventStart > 0) {
      return Promise.reject(sprintf('MemoryRepository::getEvents cannot fetch from offset %s for key \'%s\': the key does not exist.', eventStart, key));
    } else {
      result = []; // Empty object
    }
    return Promise.resolve(result);
  }

  /**
   * Put a sequence of events for an aggregate by key.
   *
   * @param key       {String}      Aggregate key to load event stream for.
   * @param initial   {Number}      Current event number of aggregate state (Default is 0/start of life.)
   * @param events    {Array}       Collection of events to put.
   *
   * @returns         {Promise}     Promise for completion of put operation.
   **/
  putEvents(key, initial, events) {
    // Validate arguments
    if (!key || typeof key !== 'string') {
      throw new Error('putEvents(key, initial, events) requires a non-null string input.');
    } else if (initial < 0) {
      throw new Error('putEvents(key, initial, events) requires a non-negative initial position');
    } else if (!events) {
      throw new Error('putEvents(key, initial, events) requires an events collection object to store');
    } else if (events.length === 0) {
      // That was easy. No events to put.
      return Promise.resolve(0);
    }

    // Validate state
    if (!this._keyToStreamMap) {
      throw new Error('Cannot getEvents on a closed MemoryRepository');
    }

    // Validate request before acting
    const existingStream = this._keyToStreamMap[key];

    // Handle appending to an existing stream and various cases.
    if (existingStream) {
      // Check conditions before applying.
      if (existingStream.length > initial) {
        return Promise.reject(sprintf('When attempting to put[key:=%s] at position %s the event stream is already at position %s. Please retry command.', key, initial, existingStream.length));
      } else if (existingStream.length < initial) {
        return Promise.reject(sprintf('When attempting to put[key:=%s] at position %s the event stream is already at position %s. Please retry command.', key, initial, existingStream.length));
      }

      // Push the events
      Array.prototype.push.apply(existingStream, events);
      return Promise.resolve(events.length);
    }

    // If we aren't pushing at 0, and we didn't get an existing stream, we can't win.
    if (initial !== 0) {
      return Promise.reject(sprintf('Cannot put[key:=%s] at position %s - There is no existing event stream to append at this position', key, initial));
    }

    // Clone events array and store to ensure immutability.
    this._keyToStreamMap[key] = events.slice(0);

    return Promise.resolve(events.length);
  }

  /**
   * Close the instance.
   **/
  close() {
    // Clean up.
    return super.close()
      .then(() => {
        this._keyToStreamMap = null;
        return Promise.resolve();
      });
  }
}

/*
MemoryRepository.simple = function (aggregateName, context) {
  // Validate arguments and scrub
  if (validation.isNullOrWhitespace(aggregateName)) {
    throw new Error('aggregateName cannot be null or whitespace');
  } else if (!context) {
    throw new Error('context cannot be null');
  }
  const aggregateTypeLookup = aggregateName.toLowerCase();

  // Create the repo list if it doesnt exist
  if (!MemoryRepository._createdRepos) {
    MemoryRepository._createdRepos = {};
  }

  // Create repo if doesn't exist
  if (!MemoryRepository._createdRepos[aggregateTypeLookup]) {
    MemoryRepository._createdRepos[aggregateTypeLookup] = new MemoryRepository(context);
  }

  // Fetch
  return MemoryRepository._createdRepos[aggregateTypeLookup];
}
*/

module.exports = MemoryRepository;
