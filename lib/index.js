/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const Aggregate = require('./aggregate');
const Repository = require('./repository');

/**
 * Create an aggregate type from the original type supplied.
 * @param aggregateBaseType     {object}    The type we are to subclass from.
 **/
function makeAggregate(aggregateBaseType) {
  /**
   * The DynamicAggregate is used to subclass the initial type specified by the user
   * and wire up the various elements of the Aggregate class. This leverages ES6 proxies
   * in lieu of true multiple inheritance.
   **/
  class DynamicAggregate extends aggregateBaseType {

    /**
     * Initialize a new instance of the aggregate type.
     **/
    constructor() {
      super(arguments);
      this._aggregateType = new Aggregate();
    }
  }

  return DynamicAggregate;
}

module.exports = {
  makeAggregate: makeAggregate,
  Repository: Repository,
};
