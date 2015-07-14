'use strict';

var blessed      = require('blessed');
var Styler       = require('../styles/styler');
var defaultStyle = require('../styles/default');
var clipboard    = require('../clipboard')();

module.exports = function listView(value, session, parent) {
  var list = blessed.list({
    parent: parent,
    items: getStyler(session).style(value),
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

  list.redraw = function() {
    list.setItems(getStyler(session).style(value));
    list.render();
    parent.render();
  };

  list.key(['-'], function() {
    session.toggleExpansion();
    list.redraw();
  });

  list.on('select', function(selected, index) {
    var child = list.datasource.getChild(list.selected);
    if (!child.hasChildren()) {
      return;
    }

    var newList = listView(child, session, parent);
    newList.key(['escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
      newList.destroy();
    });

    newList.focus();
  });

  list.key(['*'], function() {
    session.highlight(list.datasource.getChild(list.selected).toString());
    list.redraw();
  });

  list.key(['space'], function() {
    session.highlight(null);
    list.redraw();
  });


  list.key(['c', 'y'], function(item, selected) {
    clipboard.copy(list.datasource.getChild(list.selected).toString(), function() {});
  });

  parent.append(list);
  parent.render();
  return list;
};

function getStyler(session) {
  return new Styler(session, defaultStyle(session));
}
