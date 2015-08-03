/*global require, process*/
(function (r, p) {
    "use strict";
    var Server = r("karma").Server,
        config = [];

    p.stdin.on("readable", function () {
        config.push(p.stdin.read());
    });
    p.stdin.on("end", function () {
        config = JSON.parse(config.join(""));
        var server = new Server(config);
        server.start();
    });
}(require, process));
