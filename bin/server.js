#!/bin/node
((req) => {
  const { Server } = req('karma');
  const config = [];
  process.stdin.on('data', data => config.push(data));
  process.stdin.on('end', () => {
    const cfg = JSON.parse(config.join(''));
    const server = new Server(cfg);
    server.on('browsers_ready', () => { process.send('browsers_ready'); });
    server.start();
  });
})(require);
