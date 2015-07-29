'use strict';

var blessed = require('blessed');

module.exports = function(parent) {
  var input = new blessed.Textbox({
    parent: parent,
    bottom: 0,
    right: 0,
    width: 50,
    height: 1,
    style: {
      fg: 'white',
      bg: 'lightblack'
    }
  });

  return input;
};
