expect = require("chai").expect
sinon = require "sinon"
gulp = require "gulp"
glob = require "glob"

q = require "q"
path = require "path"
through = require "through2"

describe "Server unit tests (test mode)", ->
  karmaServer = undefined
  plugin = undefined
  exec_ret = undefined
  exec = undefined
  server_options = undefined
  server_start = undefined
  before ->
    process.env.testing = true
    karmaServer = require "../../../src/lib/server.coffee"
  after ->
    delete require.cache[require.resolve "../../../src/lib/server.coffee"]
    delete process.env.testing

  beforeEach ->
    server_options = undefined
    server_start = sinon.stub().callsArg(0)

    class Server
      constructor: (option, @callback) ->
        server_options = option
      start: -> server_start @callback

    exec_ret =
      "stdout":
        "pipe": sinon.spy()
      "stderr":
        "pipe": sinon.spy()
      "stdin":
        "write": sinon.spy()
        "end": sinon.spy()
      "on": sinon.spy()
      "kill": sinon.spy()
    exec = sinon.stub().returns exec_ret
    plugin = karmaServer.invoke(
      "Server": Server
      "exec": exec
    )

  describe "Calling plugin without any options", ->
    it "server.start should be called once with {file: src}", (done) ->
      gulp.src(
        "./tests/unit/data/**/*.coffee", (
          "read": false
        )
      ).pipe(
        plugin()
      ).on(
        "debug-fin",
        ->
          q.nfcall(
            glob,
            "./tests/unit/data/**/*.coffee"
          ).then(
            (files) ->
              absoluteFiles = files.map (file) ->
                path.resolve process.cwd(), file
              expect(server_start.callCount).equal 1
              expect(server_options).is.eql "files": absoluteFiles
          ).done (-> done()), done
      ).once "error", done

  describe "Calling plugin with some options", ->
    describe "files are passed as a parameter", ->
      it "option.file should be parameter one rather than source", (done) ->
        gulp.src(
          "./tests/unit/data/**/*.coffee"
          "read": false
        ).pipe(
          plugin "files": ["**/*.coffee"]
        ).on("debug-fin",
          ->
            expect(server_start.callCount).equal 1
            expect(server_options).is.eql "files": ["**/*.coffee"]
            done()
        ).on "error", done

      describe "options.quiet is passed", ->
        it "exec should be called with proper arguments", (done) ->
          gulp.src(
            "./tests/unit/data/**/*.coffee"
            "read": false
          ).pipe(
            plugin(
              "files": ["**/*.coffee"]
              "quiet": true
            )
          ).on("debug-fin",
            ->
              expect(exec.calledWith "node", [
                path.resolve("./src/lib", "../bin/server.js")
              ], ("stdio": ["pipe", "ignore", process.stderr])).is.true
              expect(
                exec_ret.stdin.write.calledWith(
                  JSON.stringify("files": ["**/*.coffee"])
                )
              ).is.true
              expect(exec_ret.stdin.end.called).is.true
              done()
          ).on "error", done

      it "Other option should be passed", (done) ->
        browsers = ["Chrome", "Firefox", "PhantomJS"]
        gulp.src(
          "./tests/unit/data/dummy1.coffee"
          "read": false
        ).pipe(
          plugin(
            "browsers": browsers
            "colors": true
          )
        ).on("debug-fin",
          ->
            expect(server_start.callCount).equal 1
            expect(server_options).is.eql (
              "files": [
                path.resolve(
                  process.cwd(),
                  "./tests/unit/data/dummy1.coffee"
                )
              ]
              "browsers": browsers
              "colors": true
            )
            done()
        ).on "error", done

describe "Server unit tests (non-test mode)", ->
  karma = undefined
  before ->
    karma = require "../../../src/lib/server.coffee"
  after ->
    delete require.cache[require.resolve "../../../src/lib/server.coffee"]

  it "The exported function shouldn't be injectable", ->
    expect(karma.invoke).is.undefined

  it "The function should be callable", ->
    expect(karma).is.a "function"
