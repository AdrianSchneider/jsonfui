'use strict';

var Value      = require('./value');
var Session    = require('./session');
var screenView = require('./views/screen');
var listView   = require('./views/list');

module.exports = function(data) {
  var list = listView(new Value(data), new Session(), screenView());
  list.focus();
};
