((req) => {
  const { spawn } = req('child_process');

  describe('Server Binary Test', () => {
    const config = req('./fixtures/single.conf.js');
    before(() => {
      config.files = config.files.concat(req('./fixtures/index.js'));
    });
    it('Should run tests thru process spawn', function (done) {
      this.timeout(10000);
      const pc = spawn('node', [req.resolve('../bin/server.js')], {
        stdio: ['pipe', 'inherit', 'pipe'],
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
