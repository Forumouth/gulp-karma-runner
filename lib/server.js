((req) => {
  const Base = req('./base.js');
  const cp = req('child_process');
  const PluginError = req('plugin-error');
  const karma = req('karma');
  class ServerPlugin extends Base {
    _flush(cb) {
      if (this.quiet) {
        const stderr = [];
        const server = cp.spawn('node', [req.resolve('../bin/server.js')], {
          stdio: ['pipe', 'ignore', 'pipe', 'ipc'],
        });
        server.on('message', (msg) => {
          this.emit(`karma.server.${msg}`);
        });
        server.stderr.on('data', data => stderr.push(data));
        server.on('error', (err) => {
          this.emit(
            'error', new PluginError(
              'karma.server', err.message, { error: err }
            )
          );
        });
        server.on('exit', (code, signal) => {
          if (code || (signal && signal.length) || stderr.length) {
            this.emit(
              'error', new PluginError(
                'karma.server',
                `The server exited with code: ${code} signal: ${signal}
                 stderr: ${stderr.join('')}`,
                { code, signal, stderr: stderr.join('') }
              )
            );
            return;
          }
          cb();
        });
        process.on('exit', () => server.kill());
        server.stdin.end(JSON.stringify(this.conf));
      } else {
        const svr = new karma.Server(this.conf, (code) => {
          if (code) {
            this.emit('error', new PluginError(
              'karma.server', `The server exited with code: ${code}`, { code }
            ));
            return;
          }
          cb();
        });
        svr.on('browsers_ready', () => {
          this.emit('karma.server.browsers_ready');
        });
        svr.start();
      }
    }
  }
  module.exports = config => new ServerPlugin(config);
})(require);
