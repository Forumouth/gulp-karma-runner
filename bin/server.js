/*global require, process*/
(function (r, p) {
    "use strict";
    var Server = r("karma").Server,
        config = [];

    p.stdin.on("readable", function () {
        config.push(p.stdin.read());
    });
    p.stdin.on("end", function () {
        var server = new Server(config);
        config = JSON.parse(config.join(""));
        server.start();
    });
}(require, process));
