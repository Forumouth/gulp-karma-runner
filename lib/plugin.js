((req) => {
  module.exports = {
    server: req('./server'),
    runner: req('./runner'),
  };
})(require);
