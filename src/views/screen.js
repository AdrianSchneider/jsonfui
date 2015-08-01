'use strict';

var blessed = require('blessed');

module.exports = function(input, output) {
  var screen = blessed.screen({ input: input, output: output });
  screen.expandJSON = false;

  /**
   * Gets the expansion flag
   *
   * @return boolean
   */
  screen.getExpansion = function() {
    return screen.expandJSON;
  };

  /**
   * Negates and gets the expansion flag
   *
   * @return boolean
   */
  screen.toggleExpansion = function() {
    screen.expandJSON = !screen.expandJSON;
    return screen.expandJSON;
  };

  screen.key(['q', 'C-c'], function(ch, key) {
    process.exit(0);
  });

  screen.highlight = function(text) {
    screen.highlighted = text;
  };

  screen.getHighlighted = function() {
    return screen.highlighted;
  };


  return screen;
};
