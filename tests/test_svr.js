((req) => {
  const plugin = req('../');
  const gulp = req('gulp');

  // args: Test tasks. The order is:
  // 1: success config with referencing configuration
  // 2: success config without referencing configuration
  // 3: failure config with referencing configuration
  // 4: failure config without referencing configuration
  const runCheck = (...args) => {
    describe('Successful test', () => {
      describe('Config file specified test', () => {
        it('The server should successfuly exit', function (done) {
          this.timeout(10000);
          gulp.on('error', done);
          gulp.series(args[0])(done);
        });
      });
      describe('Pass object directly test', () => {
        it('The server should successfuly exit', function (done) {
          this.timeout(10000);
          gulp.on('error', done);
          gulp.series(args[1])(done);
        });
      });
    });
    describe('Failure test', () => {
      describe('Config file specified test', () => {
        it('The server should exit with failure code', function (done) {
          this.timeout(10000);
          gulp.on('error', () => { done(); });
          gulp.series(args[2])((err) => {
            if (!err) {
              done(new Error('Should throw an error.'));
            }
          });
        });
      });
      describe('Pass object directly test', () => {
        it('The server should exit with failrue code', function (done) {
          this.timeout(10000);
          gulp.on('error', () => { done(); });
          gulp.series(args[3])((err) => {
            if (!err) {
              done(new Error('Should throw an error.'));
            }
          });
        });
      });
    });
  };
  const generate = (desc, ...args) => {
    describe(desc, () => {
      before(() => {
        const filesSpecs = req('./fixtures/index.js');
        const successFiles = filesSpecs.src.concat(filesSpecs.specSuccess);
        const failureFiles = filesSpecs.src.concat(filesSpecs.specFailure);
        gulp.task(
          args[0].name,
          () => gulp.src(successFiles, { read: false })
            .pipe(plugin.server(req(args[0].configFile)))
        );
        gulp.task(
          args[1].name,
          () => gulp.src(successFiles, { read: false })
            .pipe(plugin.server({
              configFile: req.resolve(args[1].configFile),
            }))
        );
        gulp.task(
          args[2].name,
          () => gulp.src(failureFiles, { read: false })
            .pipe(plugin.server(req(args[2].configFile)))
        );
        gulp.task(
          args[3].name,
          () => gulp.src(failureFiles, { read: false })
            .pipe(plugin.server({
              configFile: req.resolve(args[3].configFile),
            }))
        );
      });
      afterEach(() => { gulp.removeAllListeners('error'); });
      runCheck(args[1].name, args[0].name, args[3].name, args[2].name);
    });
  };
  generate('Server Plugin with quiet mode', {
    name: 'karma.server.quiet.normal.success',
    configFile: './fixtures/single_quiet.conf.js',
  }, {
    name: 'karma.server.quiet.normal.config.success',
    configFile: './fixtures/specified_single_quiet.conf.js',
  }, {
    name: 'karma.server.quiet.normal.failure',
    configFile: './fixtures/single_quiet.conf.js',
  }, {
    name: 'karma.server.quiet.normal.config.failure',
    configFile: './fixtures/specified_single_quiet.conf.js',
  });
  generate('Server Plugin without quiet mode', {
    name: 'karma.server.normal.success',
    configFile: './fixtures/single.conf.js',
  }, {
    name: 'karma.server.normal.config.success',
    configFile: './fixtures/specified_single.conf.js',
  }, {
    name: 'karma.server.normal.failure',
    configFile: './fixtures/single.conf.js',
  }, {
    name: 'karma.server.normal.config.failure',
    configFile: './fixtures/specified_single.conf.js',
  });
})(require);
