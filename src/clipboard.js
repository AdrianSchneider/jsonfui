'use strict';

var spawn = require('child_process').spawn;

module.exports = function(platform) {
  return {
    copy: function(value, done) {
      var command = platformCopyCommands[platform];
      if (!command) return done(new Error('Unknown system clipboard'));
      command(value, done);
    }
  };
};

var platformCopyCommands = {
  darwin: function(value, done) {
    var p = spawn('pbcopy');
    p.stdin.write(value.toString());
    p.stdin.end();

    if (done) {
      p.on('close', function() { done(); });
    }
  },
  linux: function(value, done) {
    var p = spawn('xclip', ['-selection', 'clipboard']);
    p.stdin.write(value.toString());
    p.stdin.end();

    if (done) {
      p.on('close', function() { done(); });
    }
  }
};

platformCopyCommands.openbsd = platformCopyCommands.linux;
