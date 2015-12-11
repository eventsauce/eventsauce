/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
/* global describe */
/* global it */

const ExampleAggregate = require('./example-aggregate');
const TimeKeeper = require('./example-service');

const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

describe('Aggregate Playback', () => {
  describe('Playback', () => {
    it('Example aggregate can be constructed', () => {
      const timeKeeper = new TimeKeeper();
      const mock = sinon.mock(timeKeeper);
      const instance = new ExampleAggregate(timeKeeper);
      timeKeeper.getTime();

      should.exist(instance);
      mock.verify();
    });
  });
});
