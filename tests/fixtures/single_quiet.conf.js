((req) => {
  const single = req('lodash').cloneDeep(req('./single.conf.js'));
  single.quiet = true;
  module.exports = single;
})(require);
