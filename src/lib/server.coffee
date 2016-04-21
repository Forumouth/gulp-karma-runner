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
          if optionsToPass.configFile
            optionsToPass.configFile = path.resolve optionsToPass.configFile
          if optionsToPass.quiet
            delete optionsToPass.quiet
            filePath = path.resolve(
              __dirname,
              if process.env.mode is "testing"
                "../../bin/server.js"
              else
                "../bin/server.js"
            )
            background = exec "node", [
              filePath
            ], ("stdio": ["pipe", "ignore", process.stderr])
            background.on "error", (e) =>
              @emit "error", new gutil.PluginError "Fails Unit testing"
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
  "exec": require("child_process").spawn
}

module.exports = plugin
if not process.env.testing
  module.exports = module.exports.invoke()
