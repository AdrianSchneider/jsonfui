'use strict';

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

  input.readInput(function(err, text) {
    self.screen.remove(input);
    self.screen.render();

    if(!text || !text.length) return;

    self.items.forEach(function(item) {
      item.content = '  ' + (item.content.replace(self.marker, '').trim());
    });

    self.searchResults = self.items.filter(function(item) {
      return item.content.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    }).map(function(item) {
      item.content = self.marker + (item.content.trim());
      return self.items.indexOf(item);
    });

    if(!self.searchResults.length) {
      message(parent, 'Pattern not found');
      return self.clearSearch();
    }

    self.resultNumber = -1;
    self.nextResult();
  });

  self.screen.render();

};
