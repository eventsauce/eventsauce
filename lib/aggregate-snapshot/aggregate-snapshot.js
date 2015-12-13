/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * The AggregateSnapshot represents a point-in-time capture of an aggregates state, along
 * with the current revision number.
 **/
class AggregateSnapshot {

  /**
   * Initialize a new instance of the AggregateState object type.
   * @param stateObject     {Object}    Object used to represent aggregate state.
   * @param revisionNumber  {Number}    Current revision number for the aggregate.
   **/
  constructor(stateObject, revisionNumber) {
    // Validate inputs
    if (!stateObject) {
      throw new Error('Cannot instanciate AggregateSnapshot: The stateObject cannot be null.');
    } else if (revisionNumber <= 0) {
      throw new Error('Cannot instanciate AggregateSnapshot: The revisionNumber must be greater than 0.');
    }

    // Build instance
    this._stateObject = stateObject;
    this._revisionNumber = revisionNumber;
  }

  /**
   * State of the aggregate.
   **/
  get state() {
    return this._stateObject;
  }

  /**
   * Revision number of the aggregate.
   **/
  get revisionNumber() {
    return this._revisionNumber;
  }

}

module.exports = AggregateSnapshot;
