(function() {
  var inject, merge, plugin, t;

  inject = require("node-kissdi").inject;

  merge = require("merge");

  t = require("through2");

  plugin = inject([
    "runner", function(runner) {
      return function(options) {
        var paths;
        paths = [];
        return t.obj(function(file, enc, cb) {
          if (!options || !options.files) {
            paths.push(file.path);
          }
          return cb(null, paths);
        }, function(cb) {
          var defaultOptions, optionsToPass;
          defaultOptions = {
            "files": paths
          };
          optionsToPass = merge(defaultOptions, options);
          return runner.run(optionsToPass, (function(_this) {
            return function(exitCode) {
              if (!exitCode && process.env.testing) {
                _this.emit("debug-fin");
              }
              return cb.apply(cb, arguments);
            };
          })(this));
        });
      };
    }
  ], {
    "runner": require("karma").runner
  });

  module.exports = plugin;

  if (!process.env.testing) {
    module.exports = module.exports.invoke();
  }

}).call(this);
