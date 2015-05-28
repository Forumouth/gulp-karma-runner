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
  server = undefined
  before ->
    process.env.testing = true
    karmaServer = require "../../../src/server.coffee"
  after ->
    delete require.cache[require.resolve "../../../src/server.coffee"]
    delete process.env.testing

  beforeEach ->
    server = {
      "start": sinon.stub().callsArg 1
    }
    plugin = karmaServer.invoke(
      "server": server
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
              expect(server.start.callCount).equal 1
              expect(
                server.start.calledWith "files": absoluteFiles
              ).is.ok
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
            expect(server.start.callCount).equal 1
            expect(
              server.start.calledWith "files": ["**/*.coffee"]
            ).is.ok
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
            expect(server.start.callCount).equal 1
            expect(
              server.start.calledWith(
                "files": [
                  path.resolve(
                    process.cwd(),
                    "./tests/unit/data/dummy1.coffee"
                  )
                ]
                "browsers": browsers
                "colors": true
              )
            ).is.ok
            done()
        ).on "error", done

describe "Server unit tests (non-test mode)", ->
  karma = undefined
  before ->
    karma = require "../../../src/server.coffee"
  after ->
    delete require.cache[require.resolve "../../../src/server.coffee"]

  it "The exported function shouldn't be injectable", ->
    expect(karma.invoke).is.undefined

  it "The function should be callable", ->
    expect(karma).is.a "function"
