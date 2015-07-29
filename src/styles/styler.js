'use strict';

module.exports = function Styler(session, style) {

  /**
   * Styles an object and returns an array of lines
   *
   * @param {JsonValue} value
   * @return {Array<String>} styled lines
   */
  this.style = function(value) {
    var keys = value.getChildrenKeys();
    var rows = keys.map(function(key) {
      return {
        key: key,
        child: value.getChild(keys.indexOf(key)),
        highlighted: (
          session.isHighlighted(key) ||
          session.isHighlighted(value.getChild(keys.indexOf(key)))
        )
      };
    });

    var maxLength = getMaxLength(rows);
    var highlighted = rows.filter(function(row) { return row.highlighted; }).length;

    return rows.map(function(row) {
      return pad(row.key, maxLength, ' ') + ' ' + star(row.key, row.child, highlighted) + style(row.child);
    });
  };

  /**
   * Renders the highlight star
   *
   * @param {JsonValue} value
   * @param {Number} highlighted
   * @return {String}
   */
  var star = function(key, value, highlighted) {
    if (!highlighted) return '';
    var isHighlighted = (
      session.isHighlighted(key) ||
      session.isHighlighted(value)
    );
    return isHighlighted ? '{red-fg}* {/red-fg}' : '  ';
  };

  /**
   * Calculates the max length so we can pad the keys
   *
   * @param {Array} items
   * @return {Number}
   */
  var getMaxLength = function(keys) {
    return keys.reduce(function(max, current) {
      max = Math.max(max, current.key.length);
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
