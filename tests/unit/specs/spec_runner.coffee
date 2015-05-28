expect = require("chai").expect
sinon = require "sinon"

gulp = require "gulp"
path = require "path"
glob = require "glob"
through = require "through2"
q = require "q"

describe "Runner unit tests (testing mode)", ->
  injectableFunc = undefined
  plugin = undefined
  runner = undefined

  before ->
    process.env.testing = true
    injectableFunc = require("../../../src/runner.coffee")

  after ->
    delete require.cache[require.resolve "../../../src/runner.coffee"]
    delete process.env.testing

  beforeEach ->
    runner =
      "run": sinon.stub().callsArg 1
    plugin = injectableFunc.invoke "runner": runner

  describe "Without any options", ->
    it "plugin should be called with options with files parameter", (done) ->
      gulp.src(
        "./tests/unit/data/**/*.coffee"
        "read": false
      ).pipe(
        plugin()
      ).on("debug-fin", ->
        q.nfcall(
          glob,
          "./tests/unit/data/**/*.coffee"
        ).then(
          (relativePaths) ->
            absolutePaths = relativePaths.map (relativePath) ->
              path.resolve process.cwd(), relativePath
            expect(runner.run.callCount).equal 1
            expect(
              runner.run.calledWith "files": absolutePaths
            ).is.ok
        ).done (-> done()), done
      ).once "error", done

  describe "With some options", ->
    it "file parameter should be primary rather than src when passed",
      (done) ->
        gulp.src(
          "./tests/unit/data/**/*.coffee"
        ).pipe(
          plugin("files": ["./tests/unit/data/**/*.coffee"])
        ).on("debug-fin", ->
          expect(runner.run.callCount).equal 1
          expect(
            runner.run.calledWith "files": ["./tests/unit/data/**/*.coffee"]
          ).is.ok
          done()
        ).on "error", done

describe "Runner unit tests (non-testing mode)", ->
  func = undefined

  before ->
    func = require("../../../src/runner.coffee")

  after ->
    delete require.cache[require.resolve "../../../src/runner.coffee"]

  it "The exported function shouldn't be injectable", ->
    expect(func.invoke).is.undefined

  it "The function should be callable", ->
    expect(func).is.a "function"
