# Gulp plugin for karma

[![Build Status](https://travis-ci.org/Forumouth/gulp-karma-runner.svg?branch=master)](https://travis-ci.org/Forumouth/gulp-karma-runner)

[![NPM](https://nodei.co/npm/gulp-karma-runner.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-karma-runner/)

## What this?
This is a gulp plugin for [karma](http://karma-runner.github.io/)

## How can I use it?
Generally, you can use it by normal approach. i.e. like this:

`gulpfile.js`
```javascript
/*global require*/
(function (require) {
    "use strict";
    var g = require("gulp"),
        karma = require("gulp-karma-runner");
    g.task("test", function () {
        g.src([
            "src/**/*.js",
            "test/**/*.js"
        ], {"read": false}).pipe(
            karma.server({
                "singleRun": true,
                "frameworks": ["mocha", "chai"],
                "browsers": ["Chrome", "Firefox"]
            })
        );
    });
}(require));
```
Note that the options are equivalent to Karma configucation options

## Deal with `gulp.watch`
Because this plugin provides runner, aka. a wrap of `karma runner`,
you can write 2 tasks and run server task first, then, run runner task with
watching:

`gulpfile.js`
```javascript
/*global require*/
(function (require) {
    "use strict";
    var g = require("gulp"),
        karma = require("gulp-karma-runner");
    g.task("server", function () {
        g.src([
            "src/**/*.js",
            "test/**/*.js"
        ], {"read": false}).pipe(
            karma.server({
                "singleRun": false,
                "quiet": true, // quiet mode is important to prevent multiple output
                "frameworks": ["mocha", "chai"],
                "browsers": ["Chrome", "Firefox"]
            })
        );
    });
    g.task("runner", function () {
        g.src([
            "src/**/*.js",
            "test/**/*.js"
        ], {"read": false}).pipe(
            karma.runner({
                "singleRun": false,
                "frameworks": ["mocha", "chai"],
                "browsers": ["Chrome", "Firefox"]
            })
        );
    });
    g.task("default", ["server"], function () {
        g.watch([
            "src/**/*.js",
            "test/**/*.js"
        ], ["runner"]);
    });
}(require));
```
