((req) => {
  const plugin = req('../');
  const gulp = req('gulp');
  describe('Server Plugin with quiet mode', () => {
    before(() => {
      gulp.task(
        'karma.server.quiet.normal',
        () => gulp.src(req('./fixtures/index.js'), { read: false })
          .pipe(plugin.server(req('./fixtures/single_quiet.conf.js')))
      );
      gulp.task(
        'karma.server.quiet.normal.config',
        () => gulp.src(req('./fixtures/index.js'), { read: false })
          .pipe(plugin.server({
            configFile: req.resolve('./fixtures/specified_quiet.conf.js'),
          }))
      );
    });
    afterEach(() => { gulp.removeAllListeners('error'); });
    describe('Successful test', () => {
      it('The server should successfuly exit', function (done) {
        this.timeout(10000);
        gulp.on('error', done);
        gulp.series('karma.server.quiet.normal')(done);
      });
    });
    describe('Config file specified test', () => {
      it('The server should successfuly exit', function (done) {
        this.timeout(10000);
        gulp.on('error', done);
        gulp.series('karma.server.quiet.normal.config')(done);
      });
    });
  });
})(require);
