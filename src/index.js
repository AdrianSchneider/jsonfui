'use strict';

var fs      = require('fs');
var path    = require('path');
var blessed = require('blessed');
var program = require('commander');
program
  .option('-f --filename <filename>', 'THe filename to parse')
  .parse(process.argv);

var screen = blessed.screen();

fs.readFile(path.resolve(process.cwd(), program.filename), function(err, content) {
  var json = content.toString('utf-8');

  var data = JSON.parse(json);
  var list = blessed.list({
    parent: screen,
    items: valueToList(data),
    tags: true,
    keys: true,
    vi: true,
    border: {
      type: 'line',
      fg: 'lightblack'
    },
    selectedFg: 'black',
    selectedBg: 'green',
  });

  list.focus();
  screen.append(list);
  screen.render();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();

function valueToList(value) {
  var items;
  var l, r;

  if(Array.isArray(value)) {
    items = value;
    l = '[ ';
    r = ' ]';
  } else {
    items = Object.keys(value);
    l =  '{ ';
    r = ' }';
  }

  var first = 0;
  var last = items.length -1;

  items[first] = l + items[0];
  for (var i = first + 1; i <= last; i++) {
    items[i] = '  ' + items[i];
  }
  items[last] = items[last] + r;
  return items;
}
