/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';
/* global beforeEach */
/* global describe */
/* global it */
const eventSauce = require('../../lib');
const chai = require('chai');
const expect = chai.expect;

describe('CommandBus', () => {
  describe('Construction', () => {
    it('Should succeed without parameters', () => {
      expect(() => {
        const instance = new eventSauce.CommandBus();
        instance.toString();
      }).to.not.throw(Error);
    });
  });

  describe('Operations', () => {
    let instance = null;

    beforeEach(() => {
      instance = new eventSauce.CommandBus();
    });

    describe('mapCommand', () => {
      it('Should succeed with [object: {commandName, handleCommand}]', () => {
        expect(() => {
          instance.mapCommand({
            commandName: 'FooCommand',
            handleCommand: function handler() {
            },
          });
        }).to.not.throw(Error);
      });

      it('Should succeed with [string, function]', () => {
        expect(() => {
          instance.mapCommand('FooCommand', function handler() {});
        }).to.not.throw(Error);
      });

      it('Should fail with [string, null]', () => {
        expect(() => {
          instance.mapCommand('FooCommand', null);
        }).to.throw(Error);
      });

      it('Should fail with [null, function]', () => {
        expect(() => {
          instance.mapCommand(null, function test() {});
        }).to.throw(Error);
      });
    });
  });
});
