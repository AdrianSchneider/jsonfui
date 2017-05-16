'use strict';

var Value      = require('./value');
var Session    = require('./session');
var screenView = require('./views/screen');
var listView   = require('./views/list');

module.exports = function(data, input, output) {
  var list = listView(new Value(data, null, []), new Session(), screenView(input, output));
  list.focus();
};
