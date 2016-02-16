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
  fakePath = undefined

  before ->
    process.env.testing = true
    injectableFunc = require("../../../src/lib/runner.coffee")

  after ->
    delete require.cache[require.resolve "../../../src/lib/runner.coffee"]
    delete process.env.testing

  beforeEach ->
    runner =
      "run": sinon.stub().callsArg 1
    fakePath =
      "resolve": sinon.stub().returns "called"
    plugin = injectableFunc.invoke(
      "runner": runner,
      "path": fakePath
    )

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
            expect(runner.run.calledWith "files": absolutePaths).is.true
        ).done (-> done()), done
      ).once "error", done

  describe "With some options", ->
    it "file parameter should be primary rather than src when passed",
      (done) ->
        gulp.src(
          "./tests/unit/data/**/*.coffee"
        ).pipe(
          plugin(
            "files": ["./tests/unit/data/**/*.coffee"],
            "configFile": "karma.conf.js"
          )
        ).on("debug-fin", ->
          expect(runner.run.callCount).equal 1
          expect(
            runner.run.calledWith(
              (
                "files": ["./tests/unit/data/**/*.coffee"],
                "configFile": fakePath.resolve.returnValues[0]
              )
            )
          ).is.ok
          expect(fakePath.resolve.calledOnce).is.true
          done()
        ).on "error", done

describe "Runner unit tests (non-testing mode)", ->
  func = undefined

  before ->
    func = require("../../../src/lib/runner.coffee")

  after ->
    delete require.cache[require.resolve "../../../src/lib/runner.coffee"]

  it "The exported function shouldn't be injectable", ->
    expect(func.invoke).is.undefined

  it "The function should be callable", ->
    expect(func).is.a "function"
