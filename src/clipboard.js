'use strict';

var spawn = require('child_process').spawn;

module.exports = function() {
  return {
    copy: function(value, done) {
      var p = spawn('pbcopy');
      p.stdin.write(value.toString());
      p.stdin.end();

      if (done) {
        p.on('close', function() { done(); });
      }
    }
  };
};
