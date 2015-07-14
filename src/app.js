'use strict';

var Value      = require('./value');
var screenView = require('./views/screen');
var listView   = require('./views/list');

module.exports = function(data) {
  var list = listView(new Value(data), screenView());
  list.focus();
};
