'use strict';

var blessed = require('blessed');
var spawn = require('child_process').spawn;
var expand = false;

module.exports = function listView(data, parent) {
  var list = blessed.list({
    parent: parent,
    items: valueToList(data, parent.getExpansion()),
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

  list.key(['-', 'space'], function() {
    list.setItems(valueToList(data, parent.toggleExpansion()));
    list.render();
    parent.render();
  });

  list.on('select', function(selected, index) {
    var children = (function() {
      if(Array.isArray(data)) {
        return data[index];
      }
      var keys = Object.keys(data);
      var key = keys[index];
      return data[key];
    })();

    if(children === null) return;
    if(typeof children !== 'object') return;
    if(!Array.isArray(children) && !Object.keys(children).length) return;
    if(Array.isArray(children) && !children.length) return;

    var newList = listView(children, parent);
    newList.key(['escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
      newList.destroy();
    });

    newList.focus();
  });

  list.key(['c', 'y'], function(item, selected) {
    var content = (function() {
      if(Array.isArray(data)) return data[list.selected];
      return data[Object.keys(data)[list.selected]];
    })();
    if(typeof content === 'object') content = JSON.stringify(content);
    copy(content, function() {});
  });

  parent.append(list);
  parent.render();
  return list;
};

function valueToList(value, expand) {
  var isArray = Array.isArray(value);
  var items = Object.keys(value).map(function(key) {
    return [isArray ? '[' + key + ']' : key, value[key]];
  });

  var maxLength = items
    .map(function(item) { return item[0]; })
    .reduce(function(max, current) {
      max = Math.max(max, current.length);
      return max;
    }, 0);

  return items.map(function(item) {
    return pad(item[0], maxLength) + ' ' + display(item[1], expand);
  });
}

function pad(str, len) {
  while (str.length < len) {
    str += ' ';
  }
  return str;
}

function display(item, expand) {
  if(item === null)             return '{grey-fg}null{/grey-fg}';
  if(typeof item === 'string' && /^([a-z0-f]{24})$/.test(item)) return '{yellow-fg}"{/yellow-fg}{green-fg}{bold}' + item + '{/bold}{/green-fg}{yellow-fg}"{/yellow-fg}';
  if(typeof item === 'string')  return '{yellow-fg}"{/yellow-fg}{green-fg}' + item + '{/green-fg}{yellow-fg}"{/yellow-fg}';
  if(typeof item === 'number')  return '{white-fg}' + item + '{/white-fg}';
  if(typeof item === 'boolean') return '{cyan-fg}' + item + '{/cyan-fg}';

  if(expand) {
    var out = JSON.stringify(item);
    return '{blue-fg}' + out[0] + '{/blue-fg}' +
        '{blue-fg}' + out.substr(1).substr(0, out.length -2) + '{/blue-fg}' +
        '{blue-fg}' + out.substr(-1) + '{/blue-fg}';
  }

  if(Array.isArray(item)) return '{blue-fg}[ (' + item.length + ') ]{/blue-fg}';
  if(typeof item === 'object' && Object.keys(item).length) return '{blue-fg}{ ... }{/blue-fg}';

  return item;
}

function copy(text, done) {
  var p = spawn('pbcopy');
  p.stdin.write(text);
  p.stdin.end();
  p.on('close', function() {
    done();
  });
}
