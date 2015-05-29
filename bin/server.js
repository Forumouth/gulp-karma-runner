/*global require, process*/
(function (r, p) {
    "use strict";
    var server = r("karma").server,
        config = [];

    p.stdin.on("readable", function () {
        config.push(p.stdin.read());
    });
    p.stdin.on("end", function () {
        config = JSON.parse(config.join(""));
        server.start(config);
    });
}(require, process));
