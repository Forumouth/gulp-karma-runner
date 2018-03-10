((req) => {
  const glob = req('glob').sync;
  const opts = { absolute: true, cwd: __dirname };
  module.exports = {
    src: glob('./src/**/*.js', opts),
    specSuccess: glob('./tests/success/**/*.js', opts),
    specFailure: glob('./tests/failure/**/*.js', opts),
  };
  module.exports.spec = module.exports.specSuccess.concat(
    module.exports.specFailure
  );
  module.exports.all = module.exports.src.concat(module.exports.spec);
})(require);
