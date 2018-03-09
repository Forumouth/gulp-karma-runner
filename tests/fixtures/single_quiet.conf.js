((req) => {
  const _ = req('lodash');
  const single = _.cloneDeep(req('./single.conf.js'));
  single.quiet = true;
  module.exports = single;
})(require);
