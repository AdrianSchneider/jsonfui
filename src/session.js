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

  this.hasSearch = function() {
    return !!highlighted;
  };

  this.isHighlighted = function(value) {
    return highlighted !== null && value.toString().indexOf(highlighted) !== -1;
  };

  this.getExpansion = function() {
    return expansion;
  };

  this.toggleExpansion = function() {
    expansion = !expansion;
    return expansion;
  };

};
