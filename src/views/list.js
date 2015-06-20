'use strict';

var blessed = require('blessed');

module.exports = function listView(data, parent) {
  var list = blessed.list({
    parent: parent,
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

  list.setPayload = function(payload) {
    list.payload = payload;
    list.items = valueToList(payload);
  };

  list.on('select', function(selected, index) {
    var children = (function() {
      if(Array.isArray(data)) {
        return data[index];
      }
      var keys = Object.keys(data);
      var key = keys[index];
      return data[key];
    })();

    if(typeof children !== 'object') return;
    if(!Array.isArray(children) && !Object.keys(children).length) return;
    if(Array.isArray(children) && !children.length) return;

    var newList = listView(children, parent);
    newList.key(['escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
    });

    newList.focus();
  });

  parent.append(list);
  parent.render();
  return list;
};

function valueToList(value) {
  var items = Object.keys(value).map(function(key) {
    return [key, value[key]];
  });

  var maxLength = items
    .map(function(item) { return item[0]; })
    .reduce(function(max, current) {
      max = Math.max(max, current.length);
      return max;
    }, 0);

  return items.map(function(item) {
    return pad(item[0], maxLength) + ' ' + display(item[1]);
  });
}

function pad(str, len) {
  while (str.length < len) {
    str += ' ';
  }
  return str;
}

function display(item) {
  if(item === null)             return '{grey-fg}null{/grey-fg}';
  if(typeof item === 'string')  return '{yellow-fg}"{/yellow-fg}{green-fg}' + item + '{/green-fg}{yellow-fg}"{/yellow-fg}';
  if(typeof item === 'number')  return '{white-fg}' + item + '{/white-fg}';
  if(typeof item === 'boolean') return '{cyan-fg}' + item + '{/cyan-fg}';

  if(Array.isArray(item)) return '{blue-fg}[ (' + item.length + ') ]{/blue-fg}';
  if(typeof item === 'object' && Object.keys(item).length) return '{blue-fg}{ ... }{/blue-fg}';

  return item;
}
