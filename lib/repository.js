/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * The Repository is the source of aggregates in the event sourcing model. It is
 * responsible for loading and appending to event streams.
 **/
class Repository {

  /**
   * Initialize a new instance of the Repository base class.
   **/
  constructor() {
    // Intentionally blank, for now.
  }

  /**
   * Close the repository and dispose any resources.
   **/
  close() {
    return Promise.resolve();
  }
}

module.exports = Repository;
