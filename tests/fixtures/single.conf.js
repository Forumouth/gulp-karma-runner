((req) => {
  const base = req('lodash').cloneDeep(req('./base.conf.js'));
  base.singleRun = true;
  module.exports = base;
})(require);
