((req) => {
  const { spawn } = req('child_process');

  describe('Server Binary Test', () => {
    let config;
    before(() => {
      delete req.cache[req.resolve('./fixtures/single.conf.js')];
      config = req('./fixtures/single.conf.js');
      const fixtures = req('./fixtures/index.js');
      config.files = config.files.concat(fixtures.src, fixtures.specSuccess);
    });
    it('Should run tests thru process spawn', function (done) {
      this.timeout(10000);
      const pc = spawn('node', [req.resolve('../bin/server.js')], {
        stdio: ['pipe', 'inherit', 'pipe', 'ipc'],
      });
      const err = [];
      pc.stderr.on('data', (data) => { err.push(data); });
      pc.on('error', done);
      pc.on('exit', (code, signal) => {
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
