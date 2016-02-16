inject = require("node-kissdi").inject
merge = require "merge"
t = require "through2"
gutil = require "gulp-util"

plugin = inject [
  "runner",
  "path"
  (runner, path) ->
    (options) ->
      paths = []
      t.obj(
        (file, enc, cb) ->
          if not options or not options.files
            paths.push file.path
          cb null, paths
        (cb) ->
          defaultOptions =
            "files": paths
          optionsToPass = merge defaultOptions, options
          if optionsToPass.configFile
            optionsToPass.configFile = path.resolve optionsToPass.configFile
          runner.run optionsToPass, (exitCode) =>
            if not exitCode and process.env.testing
              @emit("debug-fin")
            if exitCode
              cb new gutil.PluginError(
                "gulp-karma-runner.runner",
                "Failed Unit Tests!"
              )
            else
              cb()
      )
], (
  "runner": require("karma").runner,
  "path": require("path")
)

module.exports = plugin

if not process.env.testing
  module.exports = module.exports.invoke()
