((req) => {
  const gulp = req('gulp');
  const plugin = req('../');
  const { stopper: karmaStopper } = req('karma');

  describe('Karma runner test', () => {
    const quietConfig = req('./fixtures/quiet.conf.js');
    // tasks syntax: [server, runner]
    const check = (successTasks, failureTasks) => {
      describe('Success Case', () => {
        beforeEach(function (done) {
          this.timeout(10000);
          gulp.on('karma.server.browsers_ready', done);
          gulp.series(successTasks[0])();
        });
        it('Should success the test', (done) => {
          gulp.on('error', done);
          gulp.series(successTasks[1])(done);
        });
      });
      describe('Failure Case', () => {
        beforeEach(function (done) {
          this.timeout(10000);
          gulp.series(failureTasks[0])();
          gulp.on('karma.server.browsers_ready', done);
        });
        it('Should fail the test', (done) => {
          gulp.on('error', () => done());
          gulp.series(failureTasks[1])((err) => {
            if (!err) done(new Error('Should have an error.'));
          });
        });
      });
    };
    before(() => {
      const fixtures = req('./fixtures/index.js');
      const success = fixtures.src.concat(fixtures.specSuccess);
      const failure = fixtures.src.concat(fixtures.specFailure);
      gulp.task(
        'karma.server.success.obj', () => gulp.src(success, { read: false })
          .pipe(plugin.server(quietConfig))
          .on('karma.server.browsers_ready', () => {
            gulp.emit('karma.server.browsers_ready');
          })
      );
      gulp.task(
        'karma.server.success.file', () => gulp.src(success, { read: false })
          .pipe(plugin.server({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          })).on('karma.server.browsers_ready', () => {
            gulp.emit('karma.server.browsers_ready');
          })
      );
      gulp.task(
        'karma.server.failure.obj', () => gulp.src(failure, { read: false })
          .pipe(plugin.server(quietConfig))
          .on('karma.server.browsers_ready', () => {
            gulp.emit('karma.server.browsers_ready');
          })
      );
      gulp.task(
        'karma.server.failure.file', () => gulp.src(failure, { read: false })
          .pipe(plugin.server({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          })).on('karma.server.browsers_ready', () => {
            gulp.emit('karma.server.browsers_ready');
          })
      );
      gulp.task(
        'karma.runner.success.obj', () => gulp.src(success, { read: false })
          .pipe(plugin.runner(quietConfig))
      );
      gulp.task(
        'karma.runner.success.file', () => gulp.src(success, { read: false })
          .pipe(plugin.runner({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          }))
      );
      gulp.task(
        'karma.runner.failure.obj', () => gulp.src(failure, { read: false })
          .pipe(plugin.runner(quietConfig))
      );
      gulp.task(
        'karma.runner.failure.file', () => gulp.src(failure, { read: false })
          .pipe(plugin.runner({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          }))
      );
    });
    afterEach(() => {
      gulp.removeAllListeners('error');
      gulp.removeAllListeners('karma.server.browsers_ready');
      karmaStopper.stop(quietConfig, () => {});
    });
    describe('Object config is directly passed', () => {
      check(
        ['karma.server.success.obj', 'karma.runner.success.obj'],
        ['karma.server.failure.obj', 'karma.runner.failure.obj']
      );
    });
    describe('config file is passed', () => {
      check(
        ['karma.server.success.file', 'karma.runner.success.file'],
        ['karma.server.failure.file', 'karma.runner.failure.file']
      );
    });
  });
})(require);
