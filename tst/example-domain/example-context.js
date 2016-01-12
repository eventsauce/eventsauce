/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const eventSauce = require('../../lib');
const BoundedContext = eventSauce.BoundedContext;
const CreatedEvent = require('./created-event');
const TickEvent = require('./tick-event');
const TockEvent = require('./tock-event');

/**
 * Example context for unit testing.
 */
class ExampleContext extends BoundedContext {

  /**
   * Initialize a new instance of the ExampleContext
   */
  constructor() {
    super();

    this.defineEvent('created', CreatedEvent.fromObject);
    this.defineEvent('tick', TickEvent.fromObject);
    this.defineEvent('tock', TockEvent.fromObject);
  }
}

module.exports = ExampleContext;
