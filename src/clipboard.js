'use strict';

var spawn = require('child_process').spawn;

module.exports = function() {
  return {
    copy: function(text, done) {
      var p = spawn('pbcopy');
      p.stdin.write(text);
      p.stdin.end();
      p.on('close', function() {
        done();
      });
    }
  };
};
