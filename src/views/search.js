'use strict';

var blessed = require('blessed');

module.exports = function(parent) {
  var input = new blessed.Textbox({
    parent: parent,
    right: 0,
    bottom: 0,
    height: 1,
    width: 50,
    style: {
      fg: 'white',
      bg: 'lightblack'
    }
  });

  return input;
};
