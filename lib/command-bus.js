/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const debug = require('debug')('eventsauce:CommandBus');
const overload = require('./overload');
const sprintf = require('sprintf-js').sprintf;
const validation = require('./validation-helpers');

/**
 * The CommandBus class defines the API for dispatching commands to a domain.
 * Each command has a corresponding CommandHandler that must be registered which
 * maps the command into a specifc call against an aggregate. This serves as
 * the domain/client decoupling layer in a CQRS/ES architecture.
 */
class CommandBus {

  /**
   * Initialize a new instance of the CommandBus
   */
  constructor() {
    this._commandMap = {};
  }

  /**
   * Map a command with the command bus for handling. Parameter 1 can be a string
   * literal or an object that exposes a .commandName property and a .handleCommand
   * method.
   *
   * @param {string}    commandType       - Command type to map.
   * @param {function}  commandCallback   - Callback function for handling command.
   **/
  mapCommand(commandType, commandCallback) {
    if (overload.match(arguments, [{
      commandName: 'string',
      handleCommand: 'function',
    }])) {
      const handlerName = validation.capitalizeFirstLetter(commandType.commandName);
      this._commandMap[handlerName] = commandCallback;
    } else if (overload.match(arguments, ['string', 'function'])) {
      this._commandMap[commandType] = commandCallback;
    } else {
      throw new Error('Could not mapCommand. Expected either (string, callback) or (commandHandler)');
    }
  }

  /**
   * Process a command in our domain
   * @param {Command}     command           - Command to process
   */
  processCommand(command) {
    // Validate argument format
    if (!overload.match(arguments, [{
      commandName: 'string',
    }])) {
      debug('Command list did not match expected overload definitions');
      throw new Error('Cannot processCommand: command should be non-null and have a commandName property');
    }

    // Lookup handler
    const handlerName = validation.capitalizeFirstLetter(command.commandName);
    const handler = this._commandMap[handlerName];
    if (!handler) {
      debug(sprintf('No such handler for command %s', handlerName));
      throw new Error(sprintf('Cannot processCommand: the command type \'%s\' is not mapped.', handlerName));
    }

    try {
      debug(sprintf('Running handler for command %s', handlerName));
      console.log(command);
      const result = handler(command);
      if (result.then) {
        debug(sprintf('Returning promise result for command %s', handlerName));
        return result;
      }

      debug(sprintf('Returning non-promise result for command %s', handlerName));
      return Promise.resolve(result);
    } catch (err) {
      debug(sprintf('Promise generation for processCommand %s threw error: s', handlerName, err));
      return Promise.reject(err);
    }
  }
}

module.exports = CommandBus;
