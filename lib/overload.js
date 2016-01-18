/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * Is the specified value equivelent to the descriptor?
 * @param {object}      value       - Value to check.
 * @param {object}      descriptor  - Descriptor to compare to.
 * @returns {Boolean}               - True if equivelent.
 */
function compatible(value, descriptor) {
  if (!value) {
    // If we're a null, then we can't validate.
    return false;
  } else if (!descriptor) {
    return true;
  }

  const descriptorType = typeof descriptor;
  if (descriptorType === 'string') {
    return typeof value === descriptor;
  } else if (descriptorType === 'function') {
    return descriptor(value);
  } else if (descriptorType === 'object') {
    let matched = true;
    Object.keys(descriptor).forEach((key) => {
      const fromValue = value[key];
      const fromDescriptor = descriptor[key];
      if (!compatible(fromValue, fromDescriptor)) {
        matched = false;
      }
    });
    return matched;
  }

  throw new Error('Unknown descriptor type: ' + descriptorType);
}

/**
 * Does the specified method match the overload requirements for the method?
 * @param {Array}     args      - Method arguments
 * @param {Array}     typeMap   - Type map
 * @returns {Boolean}           - True if matches, false otherwise.
 */
function match(args, typeMap) {
  // No arguments, no win.
  if (!args || !args.length) {
    throw new Error('Cannot perform overload.match: args must be non-null array');
  } else if (!typeMap || !typeMap.length) {
    // We always satisfy a null or empty typeMap
    return true;
  }

  // Validate the arguments one by one
  for (let index = 0; index < args.length; index++) {
    if (!compatible(args[index], typeMap[index])) {
      return false;
    }
  }

  // If not incompatible, sucess
  return true;
}

module.exports = {
  match,
};
