(function() {
  var inject, merge, plugin, through;

  inject = require("node-kissdi").inject;

  through = require("through2");

  merge = require("merge");

  plugin = inject([
    "server", function(server) {
      return function(options) {
        var paths;
        paths = [];
        return through.obj(function(file, enc, cb) {
          if (!options || !options.files) {
            paths.push(file.path);
          }
          return cb(null, file);
        }, function(cb) {
          var default_options;
          default_options = {
            "files": paths
          };
          return server.start(merge(default_options, options), ((function(_this) {
            return function(exitCode) {
              if (!exitCode && process.env.testing) {
                _this.emit("debug-fin");
              }
              return cb.apply(cb, arguments);
            };
          })(this)));
        });
      };
    }
  ], {
    "server": require("karma").server
  });

  module.exports = plugin;

  if (!process.env.testing) {
    module.exports = module.exports.invoke();
  }

}).call(this);
