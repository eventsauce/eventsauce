/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * The ExampleState object represents the root state object for our aggregate
 * definition. It processes event playback to produce a self-contained model of
 * the world. The state objects hold no validation logic.
 **/
class ExampleState {
  /**
   * Initialize a new instance of the state object and set 'revision 0' property
   * values where applicable.
   **/
  constructor() {
    this._created = false;
    this._createdTime = null;
    this._tickCount = 0;
  }

  /**
   * The aggregate has been created.
   * @param eventData   {CreationEventArgs}   Creation event arguments.
   **/
  onCreated(eventData) {
    if (!eventData) {
      return;
    }

    this._created = true;
    this._createdTime = eventData.time;
  }

  /**
   * We have ticked
   * @param eventData   {TickEventArgs}   Tick event arguments.
   **/
  onTick(eventData) {
    this._tickCount = this._tickCount + 1;
    this._lastTick = eventData;
  }

  /**
   * Creation time of this example aggregate.
   * @returns   {Date}      Time of creation.
   **/
  get createdTime() {
    return this._createdTime;
  }

  /**
   * Is this aggregate created?
   * @returns   {Boolean}   True is created, false otherwise.
   **/
  get isCreated() {
    return this._created;
  }

  /**
   * Total number of ticks for the state object.
   **/
  get totalTicks() {
    return this._tickCount;
  }
}

module.exports = ExampleState;
