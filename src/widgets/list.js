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
        nextResult();
        self.redraw();
      }
    });
  };

  var nextResult = function() {
    if (!session.hasSearch()) return;
    var searchResults = buildResultset();
    if (!searchResults.length) return;

    var resultIndex = searchResults.indexOf(self.selected + 1) + 1;
    if (typeof searchResults[resultIndex] === 'undefined') resultIndex = 0;

    self.select(searchResults[resultIndex] - 1);
    self.render();
    self.screen.render();
  };

  var prevResult = function() {
    if (!session.hasSearch()) return;
    var searchResults = buildResultset();
    if (!searchResults.length) return;


    var resultIndex = searchResults.indexOf(self.selected + 1) - 1;
    console.error('before correction: ' + resultIndex);
    if (typeof searchResults[resultIndex] === 'undefined') resultIndex = searchResults.length - 1;
    console.error('after correction: ' + resultIndex);

    self.select(searchResults[resultIndex] - 1);
    self.render();
    self.screen.render();
  };

  var buildResultset = function() {

    return self.items
      .map(function(row) {
        var index = self.getItemIndex(row);
        return {
          index: index,
          value: value.getChild(index)
        };
      })
      .filter(function(row) {
        return session.isHighlighted(row.value.getKey()) || session.isHighlighted(row.value);
      })
      .map(function(row) {
        return row.index + 1;
      });
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
