inject = require("node-kissdi").inject
merge = require "merge"
t = require "through2"

plugin = inject [
  "runner"
  (runner) ->
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
          runner.run optionsToPass, (exitCode) =>
            if not exitCode and process.env.testing
              @emit("debug-fin")
            cb.apply cb, arguments
      )
], (
  "runner": require("karma").runner
)

module.exports = plugin

if not process.env.testing
  module.exports = module.exports.invoke()
