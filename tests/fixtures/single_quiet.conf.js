((req) => {
  const single = req('./single.conf.js');
  single.quiet = true;
  module.exports = single;
})(require);
