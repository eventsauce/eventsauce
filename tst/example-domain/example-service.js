/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * The TimeKeeper is an example service that provides date/time support
 * for aggregates. It's always good to remove the dependencies on instrinsic
 * types, since otherwise you can't mock effectively around date/time.
**/
class TimeKeeper {

  /**
  * Get the current date/time.
  * @returns {Date}   The current date and time.
  **/
  getTime() {
    return Date.now();
  }

}

module.exports = TimeKeeper;
