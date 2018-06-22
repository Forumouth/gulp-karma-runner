((req) => {
  const path = req('path');
  const { Transform } = req('stream');
  const { parseConfig } = req('karma').config;
  const PluginError = req('plugin-error');
  class KarmaPluginBase extends Transform {
    constructor(config) {
      super({ objectMode: true });
      this.conf = parseConfig(config.configFile, config);
      this.conf.files = [];
      this.quiet = this.conf.quiet || false;
      delete this.conf.quiet;
      if (this.conf.configFile) {
        this.conf.configFile = path.resolve(this.conf.configFile);
      }
    }

    _transform(file, encoding, cb) {
      if (file.isStream()) {
        this.emit('error', new PluginError(
          'karma.plugin', 'Stream is not supported.'
        ));
        return undefined;
      }
      this.conf.files.push(path.resolve(file.path));
      return cb(null, file);
    }
  }
  module.exports = KarmaPluginBase;
})(require);
