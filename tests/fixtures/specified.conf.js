((req) => {
  const single = req('./single.conf.js');
  module.exports = config => config.set(single);
})(require);
