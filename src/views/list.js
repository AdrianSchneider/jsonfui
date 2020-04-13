'use strict';

var blessed      = require('blessed');
var Styler       = require('../styles/styler');
var defaultStyle = require('../styles/default');
var clipboard    = require('../clipboard')(process.platform);
var List         = require('../widgets/list');

module.exports = function listView(value, session, parent, breadcrumbs) {
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

  list.key(['enter'], function() {
    var output = list.getSelectedValue().toString();
    list.screen.destroy();
    console.log(output);
    process.exit(0);
  });

  list.on('selectValue', function(selected) {
    if (!selected.hasChildren()) {
      return;
    }

    var newBreadcrumbs = breadcrumbs.concat([selected.getKey()]);
    var newList = listView(selected, session, parent, newBreadcrumbs);
    newList.key(['left', 'escape', 'h'], function() {
      parent.remove(newList);
      parent.render();
      newList.destroy();
    });

    newList.focus();
  });

  list.key(['right'], function(item, selected) {
    list.enterSelected();
  });

  list.key(['c', 'y'], function(item, selected) {
    clipboard.copy(
      list.getSelectedValue().toString(),
      function(){}
    );
  });

  list.key(['p'], function() {
    var selected = list.getSelectedValue();
    var newBreadcrumbs = breadcrumbs.concat([selected.getKey()]);
    var breadcrumbsString =  newBreadcrumbs.map(function(p) {
      return typeof(p) == 'number' ? '[' + p + ']' : '["' + p + '"]';
    }).join('')
    clipboard.copy(
      breadcrumbsString,
      function(){}
    );
  });

  parent.append(list);
  parent.render();
  return list;
};
