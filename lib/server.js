(function() {
  var gutil, inject, merge, path, plugin, through;

  inject = require("node-kissdi").inject;

  through = require("through2");

  merge = require("merge");

  gutil = require("gulp-util");

  path = require("path");

  plugin = inject([
    "Server", "exec", function(Server, exec) {
      return function(options) {
        var paths;
        paths = [];
        return through.obj(function(file, enc, cb) {
          if (!options || !options.files) {
            paths.push(file.path);
          }
          return cb(null, file);
        }, function(cb) {
          var background, default_options, optionsToPass, server;
          default_options = {
            "files": paths
          };
          optionsToPass = merge(default_options, options);
          if (optionsToPass.quiet) {
            delete optionsToPass.quiet;
            background = exec(["node", path.resolve(__dirname, "../bin/server.js")].join(" "));
            background.on("error", (function(_this) {
              return function(e) {
                return _this.emit("error", new gutil.PluginError("Fails Unit testing"));
              };
            })(this));
            background.stderr.pipe(process.stderr);
            background.stdin.write(JSON.stringify(optionsToPass));
            background.stdin.end();
            process.on("exit", function() {
              return background.kill();
            });
            if (process.env.testing) {
              this.emit("debug-fin");
            }
            return cb();
          } else {
            delete optionsToPass.quiet;
            server = new Server(optionsToPass, ((function(_this) {
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
            return server.start();
          }
        });
      };
    }
  ], {
    "Server": require("karma").Server,
    "exec": require("child_process").exec
  });

  module.exports = plugin;

  if (!process.env.testing) {
    module.exports = module.exports.invoke();
  }

}).call(this);
