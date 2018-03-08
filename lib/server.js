((req) => {
  const path = req('path');
  const _ = req('lodash');
  const { Transform } = req('stream');
  const cp = req('child_process');
  const PluginError = req('plugin-error');
  class ServerPlugin extends Transform {
    constructor(config) {
      super({ objectMode: true });
      this.conf = config;
      this.conf.files = [];
      if (_.has(this.conf, 'quiet')) {
        this.quiet = this.conf.quiet;
        delete this.conf.quiet;
      }
      if (this.conf.configFile) {
        this.conf.configFile = path.resolve(this.conf.configFile);
      }
    }
    _transform(file, encoding, cb) {
      this.conf.files.push(path.resolve(file.path));
      return cb(null, file);
    }
    _flush(cb) {
      const stderr = [];
      const server = cp.spawn('node', [req.resolve('../bin/server.js')], {
        stdio: ['pipe', 'ignore', 'pipe'],
      });
      server.stderr.on('data', data => stderr.push(data));
      server.on('error', (err) => {
        this.emit(
          'error', new PluginError('karma.server', err.message, { error: err })
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
    }
  }
  module.exports = config => new ServerPlugin(config);
})(require);
