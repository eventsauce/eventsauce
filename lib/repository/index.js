/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const Repository = require('./repository');

/**
 * Define an aggregate type in the application. This returns a new class/type
 * that can be used as a prototype for members of the aggregate space.
 *
 * @param aggregateType  {object}      Prototype for subclass.
 **/
Repository.defineAggregate = function defineAggregate(aggregateType) {
  // Validate arguments
  if (!aggregateType || typeof aggregateType !== 'function') {
    throw new Error('EventSauce Error: Repository::defineAggregate requires that the "aggregateType" parameter be a class/prototype.');
  }
};

module.exports = Repository;
