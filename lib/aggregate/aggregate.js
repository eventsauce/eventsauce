/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * An EventSauce aggregate is the root of the event-sourcing hierarchy. It is the type that
 * emits/consumes events to build it's current state model.
 **/
class Aggregate extends EventEmitter {

  /**
   * Apply an event to the aggregate instance.
   * @param eventType   {string}    Event type to emit.
   * @param eventData   {object}    Event arguments/body definition.
   **/
  applyEvent(eventType, eventData) {
    this.emit(eventType, eventData);
  }

}

module.exports = Aggregate;
