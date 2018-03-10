((req) => {
  const path = req('path');
  const { Transform } = req('stream');
  const { parseConfig } = req('karma').config;
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
      this.conf.files.push(path.resolve(file.path));
      return cb(null, file);
    }
  }
  module.exports = KarmaPluginBase;
})(require);
