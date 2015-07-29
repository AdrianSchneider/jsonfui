'use strict';

var util    = require('util');
var blessed = require('blessed');

function List(options) {
  if(!options) options = {};
  if(!options.value)   throw new Error('List requires a value');
  if(!options.session) throw new Error('List requires a session');
  if(!options.styler)  throw new Error('List requires a styler');

  blessed.List.call(this, options);
  var self = this;
  var value = options.value;
  var session = options.session;
  var styler = options.styler;

  /**
   * Sets things up
   */
  var init = function() {
    self.key('/',     openSearch);
    self.key('n',     nextResult);
    self.key('S-n',   prevResult);
    self.key('space', clearHighlight);
    self.key('*',     highlight);
    self.key('-',     toggleExpansion);
    self.on('select', emitSelectedValue);
    self.setItems(styler.style(options.value));
  };

  /**
   * Redraw the list
   */
  this.redraw = function() {
    self.setItems(styler.style(options.value));
    self.render();
    options.parent.render();
  };

  /**
   * Gets the currently selected child value
   *
   * @return {JsonValue}
   */
  this.getSelectedValue = function() {
    return value.getChild(self.selected);
  };

  var openSearch = function() {

  };

  var nextResult = function() {

  };

  var prevResult = function() {

  };

  var emitSelectedValue = function(selected, index) {
    self.emit('selectValue', self.getSelectedValue());
  };

  /**
   * Toggles expansion and redraws
   */
  var toggleExpansion = function() {
    session.toggleExpansion();
    self.redraw();
  };

  /**
   * Highlights the currently selected value
   */
  var highlight = function() {
    session.highlight(self.getSelectedValue());
    self.redraw();
  };

  /**
   * Clears the highlight
   */
  var clearHighlight = function() {
    session.clearHighlight();
    self.redraw();
  };

  init();
  return self;
}

util.inherits(List, blessed.List);
module.exports = List;
