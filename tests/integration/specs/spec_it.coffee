# Test manually for integration tests: there are dedicated tasks:
# it.server.success to launch the server
# it.server.failure to launch the server
# it.runner to instruct run the test in success case
karma = require("../../../src/lib/plugin")
expect = require("chai").expect
g = require "gulp"
gutil = require "gulp-util"

karmaPlugins = [
  "karma-coffee-preprocessor"
  "karma-chrome-launcher"
  "karma-firefox-launcher"
  "karma-phantomjs-launcher"
  "karma-mocha"
  "karma-chai"
]

browsers = ["PhantomJS"]
try
  browsers = process.env.browsers.split(/\, */g)
catch

describe "Integration tests", ->
  before ->
    process.env.testing = true
  after ->
    delete process.env.testing
    delete require.cache[require.resolve "../../../src/lib/plugin"]
  describe "Success sample case", ->
    describe "Standalone mode", ->
      it "Should success the tests", (done) ->
        g.src([
          "./tests/integration/data/sample.coffee"
          "./tests/integration/data/success_sample.coffee"
        ], "read": false).pipe(
          karma.server(
            "singleRun": true
            "frameworks": ["mocha", "chai"]
            "browsers": browsers
            "preprocessors":
              "**/*.coffee": ["coffee"]
            "coffeePreprocessor":
              "options":
                "sourceMap": true
            "plugins": karmaPlugins
          )
        ).on(
          "debug-fin", -> done()
        ).on "error", done

  describe "Failure sample case", ->
    describe "Standalone mode", ->
      it "Should fail the tests", (done) ->
        g.src([
          "./tests/integration/data/sample.coffee"
          "./tests/integration/data/failure_sample.coffee"
        ], "read": false).pipe(
          karma.server(
            "singleRun": true
            "frameworks": ["mocha", "chai"]
            "browsers": browsers
            "preprocessors":
              "**/*.coffee": ["coffee"]
            "coffeePreprocessor":
              "options":
                "sourceMap": true
            "plugins": karmaPlugins
          )
        ).on(
          "debug-fin", -> done new Error "The task should throw something."
        ).on "error", (e) ->
          expect(e).is.instanceof gutil.PluginError
          done()
