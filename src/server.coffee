inject = require("node-kissdi").inject
through = require "through2"
merge = require "merge"
gutil = require "gulp-util"
path = require "path"

plugin = inject [
  "Server"
  "exec"
  (Server, exec) ->
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
          optionsToPass = merge default_options, options
          if optionsToPass.quiet
            delete optionsToPass.quiet
            background = exec([
              "node"
              path.resolve __dirname, "../bin/server.js"
            ].join " ")
            background.on "error", (e) =>
              @emit "error", new gutil.PluginError "Fails Unit testing"
            background.stderr.pipe process.stderr
            background.stdin.write JSON.stringify optionsToPass
            background.stdin.end()
            process.on "exit", ->
              background.kill()
            if process.env.testing
              @emit("debug-fin")
            cb()
          else
            delete optionsToPass.quiet
            server = new Server optionsToPass, (
              (exitCode) =>
                if not exitCode and process.env.testing
                  @emit("debug-fin")
                if exitCode
                  cb new gutil.PluginError(
                    "gulp-karma-runner.server",
                    "Failed Unit Tests!"
                  )
                else
                  cb()
            )
            server.start()
      )
], {
  "Server": require("karma").Server
  "exec": require("child_process").exec
}

module.exports = plugin
if not process.env.testing
  module.exports = module.exports.invoke()
