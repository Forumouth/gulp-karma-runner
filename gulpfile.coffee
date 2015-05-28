g = require "gulp"
plumber = require "gulp-plumber"
notify = require "gulp-notify"

linter = require "gulp-coffeelint"
compiler = require "gulp-coffee"

mocha = require "gulp-mocha"

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
  ).pipe(mocha("reporter": "dot"))

g.task "it.server", (done) ->
  karma = require "./src/plugin"
  g.src([
    "./tests/integration/data/sample.coffee"
    "./tests/integration/data/success_sample.coffee"
  ], "read": false).pipe(
    karma.server(
      "singleRun": false
      "frameworks": ["mocha", "chai"]
      "browsers": ["Chrome", "Firefox"]
      "preprocessors":
        "**/*.coffee": ["coffee"]
      "coffeePreprocessor":
        "options":
          "sourceMap": true
    )
  )
  done()

g.task "it.runner", ->
  karma = require "./src/plugin"
  g.src([
    "./tests/integration/data/sample.coffee"
    "./tests/integration/data/success_sample.coffee"
  ], "read": false).pipe(
    karma.runner(
      "singleRun": false
      "frameworks": ["mocha", "chai"]
      "browsers": ["Chrome", "Firefox"]
      "preprocessors":
        "**/*.coffee": ["coffee"]
      "coffeePreprocessor":
        "options":
          "sourceMap": true
    )
  )

g.task "compile", ["integration_tests"], ->
  g.src(
    "./src/**/*.coffee"
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

g.task "default", ->
  g.watch "./gulpfile.coffee", ["gulp-syntax-check"]
  g.watch "./tests/unit/specs/**/*.coffee", ["unit_tests"]
  g.watch "./tests/integration/specs/**/*.coffee", ["integration_tests"]
  g.watch "./src/**/*.coffee", ["compile"]
