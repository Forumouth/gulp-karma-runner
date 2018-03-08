((req) => {
  const plugin = req('../');
  const gulp = req('gulp');
  describe('Server Plugin with quiet mode', () => {
    before(() => {
      const filesSpecs = req('./fixtures/index.js');
      const successFiles = filesSpecs.src.concat(filesSpecs.specSuccess);
      const failureFiles = filesSpecs.src.concat(filesSpecs.specFailure);
      gulp.task(
        'karma.server.quiet.normal.success',
        () => gulp.src(successFiles, { read: false })
          .pipe(plugin.server(req('./fixtures/single_quiet.conf.js')))
      );
      gulp.task(
        'karma.server.quiet.normal.config.success',
        () => gulp.src(successFiles, { read: false })
          .pipe(plugin.server({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          }))
      );
      gulp.task(
        'karma.server.quiet.normal.failure',
        () => gulp.src(failureFiles, { read: false })
          .pipe(plugin.server(req('./fixtures/single_quiet.conf.js')))
      );
      gulp.task(
        'karma.server.quiet.normal.config.failure',
        () => gulp.src(failureFiles, { read: false })
          .pipe(plugin.server({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          }))
      );
    });
    afterEach(() => { gulp.removeAllListeners('error'); });
    describe('Successful test', () => {
      describe('Config file specified test', () => {
        it('The server should successfuly exit', function (done) {
          this.timeout(10000);
          gulp.on('error', done);
          gulp.series('karma.server.quiet.normal.config.success')(done);
        });
      });
      describe('Pass object directly test', () => {
        it('The server should successfuly exit', function (done) {
          this.timeout(10000);
          gulp.on('error', done);
          gulp.series('karma.server.quiet.normal.success')(done);
        });
      });
    });
    describe('Failure test', () => {
      describe('Config file specified test', () => {
        it('The server should exit with failure code', function (done) {
          this.timeout(10000);
          gulp.on('error', () => { done(); });
          gulp.series('karma.server.quiet.normal.config.failure')((err) => {
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
          gulp.series('karma.server.quiet.normal.failure')((err) => {
            if (!err) {
              done(new Error('Should throw an error.'));
            }
          });
        });
      });
    });
  });
})(require);
