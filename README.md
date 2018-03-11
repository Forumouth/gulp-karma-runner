# Gulp plugin for karma

[![Greenkeeper badge](https://badges.greenkeeper.io/Forumouth/gulp-karma-runner.svg)](https://greenkeeper.io/)

[![CIImg]][CILink] [![CovImg]][CovLink] [![MntImg]][MntLink]

[![NPMImg]][NPMLink]

[CIImg]: https://travis-ci.org/Forumouth/gulp-karma-runner.svg?branch=master
[CILink]: https://travis-ci.org/Forumouth/gulp-karma-runner
[NPMImg]: https://nodei.co/npm/gulp-karma-runner.png?downloads=true&downloadRank=true&stars=true
[NPMLink]: https://nodei.co/npm/gulp-karma-runner/
[MntImg]: https://api.codeclimate.com/v1/badges/9f62776a481df3001f7a/maintainability
[MntLink]: https://codeclimate.com/github/Forumouth/gulp-karma-runner/maintainability
[CovImg]: https://api.codeclimate.com/v1/badges/9f62776a481df3001f7a/test_coverage
[CovLink]: https://codeclimate.com/github/Forumouth/gulp-karma-runner/test_coverage

## What this?
This is a gulp plugin for [karma](http://karma-runner.github.io/)

## How can I use it?
Generally, you can use it by normal approach. i.e. like this:

`gulpfile.js`
```javascript
((require) => {
  "use strict";
  const g = require('gulp');
  const karma = require('gulp-karma-runner');
  g.task(
    'test', () => g.src(['src/**/*.js', 'test/**/*.js'], {read: false})
      .pipe(karma.server({
        singleRun: true,
        autoWatch: false,
        frameworks: ['mocha', 'chai'],
        browsers: ['ChromeHeadless'],
        plugins: [
          'karma-mocha', 'karma-chai',
          'karma-chrome-launcher'
        ]
      }));
  );
}(require));
```
Note that the options are equivalent to Karma configucation options

## Deal with `gulp.watch`
Considering browser ready event, dealing with `gulp.watch` might be a
little-bit tricky, because you might need to start runner task after ensuring
the server is ready, while gulp task finishes when the server is closed.

To handle this issue, you can declare the server task as asynchronous task,
and call the callback when `karma.server.browsers_ready` event is emitted.
In particular, like this:

`gulpfile.js`
```javascript
((req) => {
  const gulp = req('gulp');
  const karma = req('gulp-karma-runner');
  const config = {
    autoWatch: false,
    quiet: true,
    frameworks: ['mocha', 'chai'],
    browsers: ['ChromeHeadless'],
    plugins: [
      'karma-mocha', 'karma-chai',
      'karma-chrome-launcher'
    ]
  };
  gulp.task(
    'server',
    done => gulp.src(['src/**/*.js', 'tests/**/*.js'], { read:false })
      .pipe(karma.server(config))
      .once('karma.server.browsers_ready', () => done());
  });
  gulp.task(
    'runner',
    () => gulp.src(['src/**/*.js', 'tests/**/*.js'], { read:false })
      .pipe(karma.runner(config));
  );
  gulp.task(
    'default',
    gulp.series(
      'server',
      () => gulp.watch(
        ['src/**/*.js', 'tests/**/*.js'],
        gulp.series('runner')
      ),
    )
  );
})(require);
```

# Contribution
Before you create an issue/pull request,

1. Read the code
2. Read the code again
3. Understand the code
4. Understand the code again.
