((req) => {
  const conf = req('lodash').cloneDeep(req('./base.conf.js'));
  conf.quiet = true;
  module.exports = conf;
})(require);
