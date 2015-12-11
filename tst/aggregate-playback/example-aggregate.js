/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const eventSauce = require('../../lib');

/**
 * The ExampleAggregate is an example aggregate that tracks state.
 **/
class ExampleAggregate {

  /**
   * Initialize a new instance of the ExampleAggregate.
   * @param timeKeeper    {object}      Object that implements the .getTime() method.
   **/
  constructor(timeKeeper) {
    // Validate arguments
    if (!timeKeeper) {
      throw new Error('Test Error: The ExampleAggregate::ctor() requires the timeKeeper argument to be passed.');
    }

    // Build instance
    this._timeKeeper = timeKeeper;
  }

}

module.exports = eventSauce.makeAggregate(ExampleAggregate);
