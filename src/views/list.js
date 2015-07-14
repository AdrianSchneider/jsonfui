'use strict';

var blessed      = require('blessed');
var Styler       = require('../styles/styler');
var defaultStyle = require('../styles/default');
var clipboard    = require('../clipboard')();

module.exports = function listView(value, parent) {
  var list = blessed.list({
    parent: parent,
    items: getStyler(parent).style(value),
    tags: true,
    keys: true,
    vi: true,
    border: {
      type: 'line',
      fg: 'lightblack'
    },
    selectedFg: 'black',
    selectedBg: 'green',
    datasource: value
  });

  list.datasource = value;

  list.key(['-', 'space'], function() {
    parent.toggleExpansion();
    list.setItems(getStyler(parent).style(value));
    list.render();
    parent.render();
  });

  list.on('select', function(selected, index) {
    var child = list.datasource.getChild(list.selected);
    if (!child.hasChildren()) {
      return;
    }

    var newList = listView(child, parent);
    newList.key(['escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
      newList.destroy();
    });

    newList.focus();
  });

  list.key(['c', 'y'], function(item, selected) {
    clipboard.copy(list.datasource.getChild(list.selected).toString(), function() {});
  });

  parent.append(list);
  parent.render();
  return list;
};

function getStyler(parent) {
  return new Styler({ expand: parent.getExpansion() }, defaultStyle({ expand: parent.getExpansion() }));
}
