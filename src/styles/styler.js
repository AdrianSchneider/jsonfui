'use strict';

module.exports = function Styler(options, style) {

  /**
   * Styles an object and returns an array of lines
   *
   * @param {Array|Object} value
   * @return {Array<String>} styled lines
   */
  this.style = function(value) {
    var keys = value.getChildrenKeys();
    var maxLength = getMaxLength(keys);
    return keys.map(function(key) {
      return pad(key, maxLength, ' ') + ' ' + style(value.getChild(keys.indexOf(key)));
    });
  };

  /**
   * Calculates the max length so we can pad the keys
   *
   * @param {Array} items
   * @return {Number}
   */
  var getMaxLength = function(keys) {
    return keys.reduce(function(max, current) {
      max = Math.max(max, current.length);
      return max;
    }, 0);
  };

  /**
   * Pads a string to a specific length with a filler character
   *
   * @param {String} str
   * @param {Number} len
   * @param {String} chr
   * @return {String} - padded string
   */
  var pad = function(str, len, chr) {
    while (str.length < len) str += chr;
    return str;
  };

};
