((req) => {
  const glob = req('glob').sync;
  const opts = { absolute: true, cwd: __dirname };
  module.exports = [].concat(
    glob('./src/**/*.js', opts),
    glob('./tests/**/*.js', opts)
  );
})(require);
