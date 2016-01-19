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
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
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

    describe('processCommand', () => {
      let latches = null;

      // Wireup someCommand to deal with >= 0 accept
      // < 0 = reject and not defined to be a non-promise
      // response
      beforeEach(() => {
        latches = {};
        instance.mapCommand('SomeCommand', (cmd) => {
          if (cmd.latchIndex !== undefined) {
            if (cmd.latchIndex >= 0) {
              latches[cmd.latchIndex] = true;
              return Promise.resolve(cmd.latchIndex);
            }

            latches[cmd.latchIndex] = false;
            return Promise.reject(cmd.latchIndex);
          }

          if (cmd.explode) {
            throw new Error('Boom');
          }
          return -1;
        });
      });

      it('Should deal with succesful commands', () => {
        return expect(instance.processCommand({
          commandName: 'someCommand',
          latchIndex: 42,
        })).to.eventually.be.fulfilled();
      });

      it('Should deal with rejected commands', () => {
        return expect(instance.processCommand({
          commandName: 'someCommand',
          latchIndex: -84,
        })).to.eventually.be.rejected();
      });

      it('Should deal with non-promise result commands', () => {
        return expect(instance.processCommand({
          commandName: 'someCommand',
        })).to.eventually.be.fulfilled();
      });

      it('Should reject promise generators that throw exceptions', () => {
        return expect(instance.processCommand({
          commandName: 'someCommand',
          explode: true,
        })).to.eventually.be.rejected();
      });

      it('Should throw for arguments not containing commandName', () => {
        return expect(() => {
          instance.processCommand({
          invalidCommandName: 'someCommand',
        })}).to.throw(Error);
      });

      it('Should throw for unmapped commandName', () => {
        return expect(() => {
          instance.processCommand({
          commandName: 'noSuchCommand',
        })}).to.throw(Error);
      });
    });
  });
});
