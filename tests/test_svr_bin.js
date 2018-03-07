((req) => {
  const { spawn } = req('child_process');

  describe('Server Binary Test', () => {
    const config = req('./fixtures/karma_single.conf.js');
    before(() => {
      config.files = config.files.concat([
        'tests/fixtures/src/*.js',
        'tests/fixtures/tests/*.js',
      ]);
    });
    it('Should run tests thru process spawn', function spawnTest(done) {
      this.timeout(3000);
      const pc = spawn('bin/server.js', [], {
        stdio: ['pipe', 'inherit', 'pipe'],
      });
      const err = [];
      pc.stderr.on('data', (data) => { err.push(data); });
      pc.on('error', done);
      pc.on('close', (code, signal) => {
        if (code || (signal && signal.length) || err.length) {
          done(new Error(
            `Karma server exited with Code: ${code}, Signal: ${signal}
             STDERR: ${err.join('')}`
          ));
          return;
        }
        done();
      });
      pc.stdin.end(JSON.stringify(config));
    });
  });
})(require);
