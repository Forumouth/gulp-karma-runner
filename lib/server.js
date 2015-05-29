(function() {
  var gutil, inject, merge, plugin, through;

  inject = require("node-kissdi").inject;

  through = require("through2");

  merge = require("merge");

  gutil = require("gulp-util");

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
              if (exitCode) {
                return cb(new gutil.PluginError("gulp-karma-runner.server", "Failed Unit Tests!"));
              } else {
                return cb();
              }
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
