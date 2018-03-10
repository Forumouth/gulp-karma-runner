((req) => {
  const Base = req('./base.js');
  const { runner } = req('karma');
  const PluginError = req('plugin-error');

  class KarmaRunner extends Base {
    _flush(cb) {
      try {
        runner.run(this.config, (code) => {
          if (code) {
            this.emit(
              'error',
              new PluginError(
                'karma.runner', `The runner exit with code: ${code}`, { code }
              )
            );
            return;
          }
          cb();
        });
      } catch (exc) {
        this.emit(
          'error',
          new PluginError(
            'karma.runner',
            `An error has been occured while executing runner.
             For details, refer error property of this exception.`,
            { error: exc }
          )
        );
      }
    }
  }

  module.exports = cfg => new KarmaRunner(cfg);
})(require);
