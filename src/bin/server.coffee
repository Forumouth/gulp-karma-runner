Server = require("karma").Server
config = []
process.stdin.on "readable", -> config.push process.stdin.read()
process.stdin.on "end", ->
  config = JSON.parse config.join ""
  server = new Server config
  server.start()
