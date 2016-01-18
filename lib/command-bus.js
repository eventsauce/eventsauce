/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

const overload = require('./overload');
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
   * @param {string}    command           - Command to process.
   * @param {function}  commandCallback   - Callback function for handling command.
   **/
  mapCommand(command, commandCallback) {
    if (overload.match(arguments, [{
      commandName: 'string',
      handleCommand: 'function',
    }])) {
      const handlerName = validation.capitalizeFirstLetter(command.commandName);
      this._commandMap[handlerName] = commandCallback;
    } else if (overload.match(arguments, ['string', 'function'])) {
      this._commandMap[command] = commandCallback;
    } else {
      throw new Error('Could not mapCommand. Expected either (string, callback) or (commandHandler)');
    }
  }
}

module.exports = CommandBus;
