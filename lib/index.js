/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const Aggregate = require('./aggregate');
const AggregateSnapshot = require('./aggregate-snapshot');
const Event = require('./event');
const MemoryRepository = require('./memory-repository');
const Repository = require('./repository');

module.exports = {
  Aggregate: Aggregate,
  AggregateSnapshot: AggregateSnapshot,
  Event: Event,
  MemoryRepository: MemoryRepository,
  Repository: Repository,
};
