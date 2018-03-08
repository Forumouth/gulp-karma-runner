((req) => {
  const singleQuiet = req('./single_quiet.conf.js');
  module.exports = (config) => {
    config.set(singleQuiet);
    config.set({ files: req('./index.js') });
  };
})(require);
