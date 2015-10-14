(function() {
  var Server, config;

  Server = require("karma").Server;

  config = [];

  process.stdin.on("readable", function() {
    return config.push(process.stdin.read());
  });

  process.stdin.on("end", function() {
    var server;
    config = JSON.parse(config.join(""));
    server = new Server(config);
    return server.start();
  });

}).call(this);
