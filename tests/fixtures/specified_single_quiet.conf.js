((req) => {
  module.exports = config => config.set(req('./single_quiet.conf.js'));
})(require);
