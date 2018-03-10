((req) => {
  module.exports = config => config.set(req('./quiet.conf.js'));
})(require);
