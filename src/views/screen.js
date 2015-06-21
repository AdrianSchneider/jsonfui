'use strict';

var blessed = require('blessed');

module.exports = function(log) {
  var screen = blessed.screen();
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

  return screen;
};
