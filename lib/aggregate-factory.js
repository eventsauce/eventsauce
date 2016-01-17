/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const Repository = require('./repository');
const validation = require('./validation-helpers');

/**
 * The AggregateFactory defines an API for summoning up and aggregate from a repository,
 * performing operations against it and commiting the results back, writing any events
 * to a suitable bus.
 */
class AggregateFactory {

  /**
   * Initialize a new instance of the AggregateFactory with the various required
   * parameters.
   *
   * @param {Repository}    repository        - Aggregate repository
   * @param {function}      Generator         - Function that produces new aggregate instances.
   * @param {Object}        options           - Factory options
   */
  constructor(repository, generator, options) {
    // Validate arguments
    const optionSet = options || {};
    if (!repository || !(repository instanceof Repository)) {
      throw new Error('Cannot initialize AggregateFactory: repository was null or not a Repository subclass');
    } else if (!validation.isFunction(generator)) {
      throw new Error('Cannot initialize AggregateFactory: generator must be a non-null function');
    }

    // Build instance
    this._repository = repository;
    this._generator = generator;
    this._fetchSize = optionSet.fetchSize || 1000;
  }

  /**
   * Get the latest revision of an aggregate based on it's key.
   * @param {string}      key             - Aggregate key
   * @returns {Promise}                   - Promise for the aggregate instance to be loaded.
   */
  _getLatestRevision(key) {
    // Create a blank aggregate
    const aggregateState = this._generator();
    const blockLoader = (offset) => {
      return this._repository.getEvents(key, offset, this._fetchSize)
        .then((events) => {
          // No events? We're done.
          if (events.length === 0) {
            return Promise.resolve(0);
          }

          // Apply events
          aggregateState.replayEventStream(events);

          // If the number of events is exactly our fetch size, fetch
          // again just in case there's more on the other side.
          if (events.length === this._fetchSize) {
            // Fetch from the current revision
            return blockLoader(aggregateState.revisionNumber);
          }

          return Promise.resolve(events.length);
        });
    };

    // Run the block chain-loader and then resolve with state.
    return blockLoader(aggregateState.revisionNumber)
      .then(() => {
        return Promise.resolve(aggregateState);
      });
  }

  /**
   * Run an operation against an aggregate with the specified callback function.
   * @param {string}      key             - Aggregate key to load/store from
   * @param {function}    callback        - Function to call with aggregate instance.
   * @returns {Promise}                   - Promise for operation completion or rejection.
   */
  withAggregate(key, callback) {
    // Validate arguments
    if (validation.isNullOrWhitespace(key)) {
      throw new Error('Cannot perform aggregate operation: key cannot be null or whitespace');
    } else if (!validation.isFunction(callback)) {
      throw new Error('Cannot perform aggregate operation: callback must be a non-null function');
    }

    let aggregate = null;
    let initialRevision = 0;

    // Load, apply, store
    return this._getLatestRevision(key)
      .then((agg) => {
        // Store revision number and aggregate
        aggregate = agg;
        initialRevision = agg.revisionNumber;

        // Run the callback
        try {
          const result = callback(agg);

          // If the result is then-able then run that.
          if (result && result.then) {
            return result;
          }

          // Default to success with result code
          return Promise.resolve(result);
        } catch (err) {
          // Rejection handler
          return Promise.reject(err);
        }
      })
      .then(() => {
        // Write the events
        return this._repository.putEvents(key, initialRevision, aggregate.pendingEvents);
      })
      .then(() => {
        aggregate.commitState();
        return Promise.resolve(aggregate);
      });
  }
}

module.exports = AggregateFactory;
