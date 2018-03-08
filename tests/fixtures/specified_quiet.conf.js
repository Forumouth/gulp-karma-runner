((req) => {
  const singleQuiet = req('./single_quiet.conf.js');
  const files = req('./index.js');
  module.exports = (config) => {
    config.set(singleQuiet);
    config.set({ files: files.src.concat(files.specSuccess) });
  };
})(require);
