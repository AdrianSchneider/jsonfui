'use strict';

/**
 * Represents a JSON value
 *
 * @param {*} val
 * @param {String} key
 * @param {String[]} parents
 */
function JsonValue(val, key, parents) {
  var state = {};

  /**
   * Detects the type of the value
   *
   * @return {String}
   */
  this.getType = function() {
    if (this.isNull())    return 'null';
    if (this.isString())  return 'string';
    if (this.isBoolean()) return 'boolean';
    if (this.isNumber())  return 'number';
    if (this.isArray())   return 'array';
    if (this.isObject())  return 'object';
  };

  /**
   * Gets the raw value
   * @return {*}
   */
  this.getValue = function() {
    return val;
  };

  /**
   * Gets the key of this item in the parent
   *
   * @return {String|number|null}
   */
  this.getKey = function() {
    return key;
  };

  /**
   * Gets the list of parent keys
   *
   * @return {String[]}
   */
  this.getParents = function() {
    return parents;
  };

  /**
   * Checks if this value is null
   * @return {Boolean}
   */
  this.isNull = function() {
    return val === null;
  };

  /**
   * Checks if this value is a string
   * @return {Boolean}
   */
  this.isString = function() {
    return typeof val === 'string';
  };

  /**
   * Checks if this value is boolean
   * @return {Boolean}
   */
  this.isBoolean = function() {
    return typeof val === 'boolean';
  };

  /**
   * Checks if this value is a number
   * @return {Boolean}
   */
  this.isNumber = function() {
    return typeof val === 'number';
  };

  /**
   * Checks if this value is an array
   * @return {Boolean}
   */
  this.isArray = function() {
    return Array.isArray(val);
  };

  /**
   * Checks if this value is an object
   * @return {Boolean}
   */
  this.isObject = function() {
    return !this.isArray(val) && !this.isNull(val) && typeof val === 'object';
  };

  /**
   * Checks to see if this value's type can have children
   *
   * @return {Boolean}
   */
  this.canHaveChildren = function() {
    return this.isArray() || this.isObject();
  };

  /**
   * Checks to see if this value has any children nodes
   *
   * @return {Boolean}
   */
  this.hasChildren = function() {
    if (this.isArray()) {
      return !!val.length;
    }

    if (this.isObject()) {
      return !!Object.keys(val).length;
    }

    return false;
  };

  /**
   * Gets an array of the children keys
   *
   * @return {Array<String>}
   */
  this.getChildrenKeys = function() {
    return Object.keys(val);
  };

  /**
   * Gets the child value for a given index
   *
   * @param {Number} index
   * @return {JsonValue}
   */
  this.getChild = function(index) {
    if (!this.canHaveChildren()) {
      throw new Error('Cannot get children from this value');
    }

    if (this.isArray()) {
      return new JsonValue(val[index], index, parents.concat(['[' + index + ']']));
    }

    var keys = Object.keys(val);
    return new JsonValue(val[keys[index]], keys[index], parents.concat([keys[index]]));
  };

  /**
   * Converts the value to string
   *
   * @return {String}
   */
  this.toString = function() {
    if (this.canHaveChildren()) return JSON.stringify(val);
    if (val === null) return 'null';
    return val.toString();
  };

  if (!this.getType()) {
    console.error(val);
    throw new Error('Cannot determine type of value');
  }
}

module.exports = JsonValue;
