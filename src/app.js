'use strict';

var blessed = require('blessed');
var listView = require('./views/list');

module.exports = function(data) {
  var screen = blessed.screen();
  screen.key(['q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  var list = listView(data, screen);
  list.focus();
};
