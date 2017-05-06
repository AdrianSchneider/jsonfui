'use strict';

var blessed      = require('blessed');
var Styler       = require('../styles/styler');
var defaultStyle = require('../styles/default');
var clipboard    = require('../clipboard')(process.platform);
var List         = require('../widgets/list');

module.exports = function listView(value, session, parent) {
  var list = new List({
    parent: parent,
    tags: true,
    keys: true,
    vi: true,
    height: '100%-1',
    border: {
      type: 'line',
      fg: 'lightblack'
    },
    selectedFg: 'black',
    selectedBg: 'green',
    value: value,
    session: session,
    styler: new Styler(session, defaultStyle(session))
  });

  list.path = blessed.box({
    left: 1,
    bottom: 0,
    height: 1,
    content: 'Path: ' + value.getParents().join('.'),
    style: { fg: 'white' }
  });

  if (!value.getParents().length) {
    list.path.hide();
  }

  list.on('selectValue', function(selected) {
    if (!selected.hasChildren()) {
      return;
    }

    var newList = listView(selected, session, parent);
    newList.key(['escape', 'h'], function() {
      newList.screen.remove(newList.path);
      parent.remove(newList);
      parent.render();
      newList.destroy();
      newList.destroy();
    });

    newList.focus();
  });

  list.key(['c', 'y'], function(item, selected) {
    clipboard.copy(
      list.getSelectedValue().toString(),
      function(){}
    );
  });

  parent.append(list);
  parent.append(list.path);
  parent.render();

  list.screen.render();
  list.focus();

  return list;
};
