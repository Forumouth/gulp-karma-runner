((req) => {
  module.exports = config => config.set(req('./single.conf.js'));
})(require);
