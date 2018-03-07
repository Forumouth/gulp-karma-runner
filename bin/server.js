#!/bin/node
((req) => {
  const { Server } = req('karma');
  const config = [];
  process.stdin.on('readable', () => config.push(process.stdin.read()));
  process.stdin.on('end', () => {
    const cfg = JSON.parse(config.join(''));
    const server = new Server(cfg);
    server.start();
  });
})(require);
