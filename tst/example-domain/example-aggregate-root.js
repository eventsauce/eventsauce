/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const eventSauce = require('../../lib');
const Aggregate = eventSauce.Aggregate;
const ExampleState = require('./example-state');

/**
 * The ExampleAggregateRoot is an example aggregate that tracks state.
 **/
class ExampleAggregateRoot extends Aggregate {

  /**
   * Initialize a new instance of the ExampleAggregateRoot.
   * @param key           {String}      Aggregate key
   * @param timeKeeper    {Object}      Object that implements the .getTime() method.
   * @param stateObject   {Object}      Original state of aggregate (optional).
   **/
  constructor(key, timeKeeper, stateObject) {
    super(key, stateObject);

    // Validate arguments
    if (!timeKeeper) {
      throw new Error('Test Error: The ExampleAggregateRoot::ctor() requires the timeKeeper argument to be passed.');
    }

    // Build instance
    this._timeKeeper = timeKeeper;
  }

  /**
   * Create the state object for this aggregate.
   * @returns     {ExampleState}    State for ExampleAggregateRoot.
   **/
  createStateObject() {
    return new ExampleState();
  }

  /**
   * Create the aggregate.
   **/
  create() {
    // Validate state
    if (this._stateObject.isCreated) {
      throw new Error('The example aggregate has already been created, and cannot be created twice.');
    }

    // Mutate.
    this.applyEvent('created', {
      time: this._timeKeeper.getTime(),
    });
  }

  /**
   * Tick the aggregate
   **/
  tick() {
    // Validate state
    if (!this._stateObject.isCreated) {
      throw new Error('The example aggregate must be created before it can be tick/tocked');
    }

    // Mutate.
    this.applyEvent('tick', {
      time: this._timeKeeper.getTime(),
    });
  }

  /**
   * Tick the aggregate
   **/
  tock() {
    // Validate state
    if (!this._stateObject.isCreated) {
      throw new Error('The example aggregate must be created before it can be tick/tocked');
    }

    // Mutate. Should fail due to missing method.
    this.applyEvent('tock', {
      time: this._timeKeeper.getTime(),
    });
  }

  /**
   * Total number of ticks for the aggregate.
   **/
  get totalTicks() {
    return this._stateObject.totalTicks;
  }
}

module.exports = ExampleAggregateRoot;
