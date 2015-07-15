'use strict';

module.exports = function() {
  var highlighted;
  var expansion = false;

  this.highlight = function(value) {
    highlighted = value.toString();
  };

  this.clearHighlight = function() {
    highlighted = null;
  };

  this.isHighlighted = function(value) {
    return value.toString() === highlighted;
  };

  this.getExpansion = function() {
    return expansion;
  };

  this.toggleExpansion = function() {
    expansion = !expansion;
    return expansion;
  };

};
