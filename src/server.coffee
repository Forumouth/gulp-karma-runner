inject = require("node-kissdi").inject
through = require "through2"
merge = require "merge"

plugin = inject [
  "server"
  (server) ->
    (options) ->
      paths = []
      through.obj(
        (file, enc, cb) ->
          if not options or not options.files
            paths.push file.path
          cb null, file
        (cb) ->
          default_options =
            "files": paths
          server.start merge(default_options, options), (
            (exitCode) =>
              if not exitCode and process.env.testing
                @emit("debug-fin")
              cb.apply cb, arguments
          )
      )
], {
  "server": require("karma").server
}

module.exports = plugin
if not process.env.testing
  module.exports = module.exports.invoke()
