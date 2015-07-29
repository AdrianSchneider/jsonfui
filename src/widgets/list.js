'use strict';

var util    = require('util');
var blessed = require('blessed');
var searchWidget = require('../views/search');

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
  var search;

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

  /**
   * Triggers a small search dialog to open
   * and highlights the entered text
   */
  var openSearch = function() {
    search = searchWidget(self.screen);
    self.screen.render();

    search.readInput(function(err, text) {
      self.screen.remove(search);
      self.screen.render();

      if (text && text.length) {
        session.highlight(text);
        self.redraw();
      }
    });
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
