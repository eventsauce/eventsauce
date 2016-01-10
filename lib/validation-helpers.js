/**
 *   ___             _   ___                       EventSauce
 *   | __|_ _____ _ _| |_/ __| __ _ _  _ __ ___    CQRS / Event Sourcing Framework for NodeJS
 *   | _|\ V / -_) ' \  _\__ \/ _` | || / _/ -_)   (c) 2016 Steve Gray / eventualconsistency.net
 *   |___|\_/\___|_||_\__|___/\__,_|\_,_\__\___|   This code is GPL v2.0 licenced.
 **/
'use strict';

/**
 * Capitalize the first letter of a string.
 * @param str     {String}    Input string
 * @returns       {String}    Resultant string.
 **/
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Is the specified string a valid function that we can invoke?
 * @param func    {Object}    Candidate to test for function type.
 * @returns       {Boolean}   True if function, false if null or non-function.
 **/
function isFunction(func) {
  return func !== undefined && (typeof func) === 'function';
}

/**
 * Is the specified string null or whitespace only?
 * @param str   {String}      Input string.
 * @returns     {Boolean}     True if null, empty or whitespace only.
 **/
function isNullOrWhitespace(str) {
  return str === null || str.match(/^ *$/) !== null;
}

module.exports = {
  capitalizeFirstLetter,
  isFunction,
  isNullOrWhitespace,
};
