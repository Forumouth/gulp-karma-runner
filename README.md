# Gulp plugin for karma

[![Build Status](https://travis-ci.org/Forumouth/gulp-karma-runner.svg?branch=master)](https://travis-ci.org/Forumouth/gulp-karma-runner)

## What this?
This is a gulp plugin for [karma](http://karma-runner.github.io/)

## How can I use it?
Generally, you can use it by normal approach. i.e. like this:

`gulpfile.js`
```node_js
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
                "browsers": ["Chrome", "Firefox"],
                "coffeePreprocessor": {
                    "options": {
                        "sourceMap": true
                    }
                }
            })
        );
    });
}(require));
```
