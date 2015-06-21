'use strict';

var screenView = require('./views/screen');
var listView   = require('./views/list');

module.exports = function(data) {
  var screen = screenView();
  var list = listView(data, screen);
  list.focus();
};
