g = require "gulp"
plumber = require "gulp-plumber"
notify = require "gulp-notify"

linter = require "gulp-coffeelint"
compiler = require "gulp-coffee"

mocha = require "gulp-mocha"

g.task "compile.bin", ->
  g.src(
    "./src/bin/**/*.coffee"
  ).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    linter("./coffeelint.json")
  ).pipe(
    linter.reporter("coffeelint-stylish")
  ).pipe(
    linter.reporter("failOnWarning")
  ).pipe(
    compiler()
  ).pipe g.dest "./bin"

g.task "gulp-syntax-check", ->
  g.src(
    "./gulpfile.coffee"
  ).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    linter("./coffeelint.json")
  ).pipe(
    linter.reporter("coffeelint-stylish")
  ).pipe(
    linter.reporter("failOnWarning")
  )

g.task "unit_tests", ->
  g.src(
    "./tests/unit/specs/**/*.coffee"
  ).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    linter("./coffeelint.json")
  ).pipe(
    linter.reporter("coffeelint-stylish")
  ).pipe(
    linter.reporter("failOnWarning")
  ).pipe(mocha("reporter": "dot"))

g.task "integration_tests", ["unit_tests"], ->
  g.src(
    "./tests/integration/specs/**/*.coffee"
  ).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    linter("./coffeelint.json")
  ).pipe(
    linter.reporter("coffeelint-stylish")
  ).pipe(
    linter.reporter("failOnWarning")
  ).pipe(
    mocha(
      "reporter": "dot"
      "timeout": 10000
    )
  )

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

g.task "it.server.success", ["compile.bin"], (done) ->
  karma = require "./src/lib/plugin"
  g.src([
    "./tests/integration/data/sample.coffee"
    "./tests/integration/data/success_sample.coffee"
  ], "read": false).pipe(
    karma.server(
      "singleRun": false
      "quiet": true
      "frameworks": ["mocha", "chai"]
      "browsers": browsers
      "preprocessors":
        "**/*.coffee": ["coffee"]
      "coffeePreprocessor":
        "options":
          "sourceMap": true
      "plugins": karmaPlugins
    )
  )
  done()

g.task "it.server.failure", ["compile.bin"], (done) ->
  karma = require "./src/lib/plugin"
  g.src([
    "./tests/integration/data/sample.coffee"
    "./tests/integration/data/failure_sample.coffee"
  ], "read": false).pipe(
    karma.server(
      "singleRun": false
      "quiet": true
      "frameworks": ["mocha", "chai"]
      "browsers": browsers
      "client":
        "captureConsole": false
      "preprocessors":
        "**/*.coffee": ["coffee"]
      "coffeePreprocessor":
        "options":
          "sourceMap": true
      "plugins": karmaPlugins
    )
  )
  done()

g.task "it.runner", ->
  karma = require "./src/lib/plugin"
  g.src([
    "./tests/integration/data/sample.coffee"
    "./tests/integration/data/success_sample.coffee"
  ], "read": false).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    karma.runner()
  )

g.task "compile.lib", ["integration_tests"], ->
  g.src(
    "./src/lib/**/*.coffee"
  ).pipe(
    plumber "errorHandler": notify.onError "<%= error.message %>"
  ).pipe(
    linter("./coffeelint.json")
  ).pipe(
    linter.reporter("coffeelint-stylish")
  ).pipe(
    linter.reporter("failOnWarning")
  ).pipe(
    compiler()
  ).pipe g.dest "./lib"

g.task "compile", ["compile.bin", "compile.lib"], ->

g.task "default", ->
  g.watch "./gulpfile.coffee", ["gulp-syntax-check"]
  g.watch "./tests/unit/specs/**/*.coffee", ["unit_tests"]
  g.watch "./tests/integration/specs/**/*.coffee", ["integration_tests"]
  g.watch "./src/**/*.coffee", ["compile"]
