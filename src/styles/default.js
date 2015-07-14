'use strict';

var sprintf = require('util').format;

module.exports = function(options) {
  return function(value) {
    if (value.isNull()) {
      return '{grey-fg}null{/grey-fg}';
    }

    if (value.isString()) {
      if (/^([a-z0-f]{24})$/.test(value)) {
        return sprintf(
          '{yellow-fg}"{/yellow-fg}{green-fg}{bold}%s{/bold}{/green-fg}{yellow-fg}"{/yellow-fg}',
          value.getValue()
        );
      }
      return sprintf('{yellow-fg}"{/yellow-fg}{green-fg}%s{/green-fg}{yellow-fg}"{/yellow-fg}', value.getValue());
    }

    if (value.isNumber()) {
      return sprintf('{white-fg}%s{/white-fg}', value.getValue());
    }

    if (value.isBoolean()) {
      return sprintf('{cyan-fg}%s{/cyan-fg}', value.getValue());
    }

    if (options.expand && value.hasChildren()) {
      var out = value.toString();
      return '{blue-fg}' + out[0] + '{/blue-fg}' +
          '{blue-fg}' + out.substr(1).substr(0, out.length -2) + '{/blue-fg}' +
          '{blue-fg}' + out.substr(-1) + '{/blue-fg}';
    }

    if (value.isArray()) {
      return sprintf('{blue-fg}[ (%d) ]{/blue-fg}', value.getValue().length);
    }

    if (value.isObject()) {
      return '{blue-fg}{ ... }{/blue-fg}';
    }

    return value.getValue();
  };
};
