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

  list.on('selectValue', function(selected) {
    if (!selected.hasChildren()) {
      return;
    }

    var newList = listView(selected, session, parent);
    newList.key(['escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
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
  parent.render();
  return list;
};
