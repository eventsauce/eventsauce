/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
const AggregateSnapshot = require('./aggregate-snapshot');
const AggregateEvent = require('./aggregate-event');
const sprintf = require('sprintf-js').sprintf;
const validationHelpers = require('./validation-helpers');

/**
 * An EventSauce aggregate is the root of the event-sourcing hierarchy. It is the type that
 * emits/consumes events to build it's current state model.
 **/
class Aggregate {

  /**
   * Initialize the new instance of the aggregate.
   *
   * @param key         {string}              Aggregate key value.
   * @param snapshot    {AggregateSnapshot}   Snapshot of aggregate to load, if applicable.
   **/
  constructor(key, snapshot) {
    this._keyValue = key;
    this._isReplaying = false;

    if (snapshot) {
      // Snapshot load
      this._stateObject = snapshot.state;
      this._revisionNumber = snapshot.revisionNumber;
    } else {
      // Blank aggregate.
      this._revisionNumber = 0;
      this._stateObject = this.createStateObject();
    }
    this._uncommitedEvents = [];
  }

  /**
   * Apply an event to the aggregate instance.
   * @param eventInstance   {AggregateEvent}    Event to apply.
   **/
  applyEvent(eventInstance) {
    if (!eventInstance || !(eventInstance instanceof AggregateEvent)) {
      throw new Error('Cannot applyEvent: eventInstance must be a non-null AggregateEvent subclass');
    }

    const methodName = 'on' + validationHelpers.capitalizeFirstLetter(eventInstance.eventType);
    if (!validationHelpers.isFunction(this._stateObject[methodName])) {
      throw new Error(sprintf('Critical error: the event type handler \'%s\' is not defined on the state object for this aggregate.', methodName));
    }

    // Apply event
    this._stateObject[methodName](eventInstance);
    this._uncommitedEvents.push(eventInstance);
  }

  /**
   * Create a new state object.
   * @returns {Object}      - State object for this aggregate.
   */
  createStateObject() {
    return {};
  }

  /**
   * Replay a set of committed events and restore the aggregate to it's current state.
   * @param events      {Array}     Must be an array with at least one event to apply.
   **/
  replayEventStream(events) {
    // Validate inputs
    if (!events || !events.length) {
      throw new Error('Cannot replay events: the events object must be an array with a length of at least 1.');
    }

    // Apply the events
    events.forEach(event => {
      this.replaySingleEvent(event);
    });

    // Set state and commit
    this.commitState();
  }

  /**
   * Replay a single committed event for this aggregate type.
   * @param eventType   {String}    Event type to replay.
   * @param eventData   {Object}    Event arguments/body definition.
   **/
  replaySingleEvent(eventType, eventData) {
    const originalReplayState = this._isReplaying;
    this._isReplaying = true;
    try {
      this.applyEvent(eventType, eventData);
      this._revisionNumber = this._revisionNumber + 1;
    } finally {
      this._isReplaying = originalReplayState;
    }
  }

  /**
   * Set the current state of the aggregate in memory as having been commited. This
   * clears the pending events and updates the current revision number, but is not
   * responsible for storing the aggregate to the repository.
   **/
  commitState() {
    this._revisionNumber = this._revisionNumber + this._uncommitedEvents.length;
    this._uncommitedEvents = [];
  }

  /**
   * Generate a snapshot for the current aggregate.
   * @returns   {AggregateSnapshot}   Snapshot of current aggregate state.
   **/
  generateSnapshot() {
    return new AggregateSnapshot(this._stateObject, this._revisionNumber);
  }

  /**
   * Current state object for the aggregate. Should be used only within
   * the aggregate types, and not for external consumption or modification.
   * @returns   {Object}            Aggregate state
   **/
  get currentState() {
    return this._stateObject;
  }

  /**
   * Get the revision number of the aggregate.
   * @returns   {Number}    Revision number of the current aggregate state.
   **/
  get revisionNumber() {
    return this._revisionNumber;
  }

  /**
   * Get the pending events of this aggregate. This operation is a shallow clone, and
   * operating on array members is considered undefined behaviour.
   * @returns   {Array}   List of events pending commit.
   **/
  get pendingEvents() {
    return this._uncommitedEvents.slice(0);
  }
}

module.exports = Aggregate;
