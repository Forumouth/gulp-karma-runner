expect = require("chai").expect

server = require "../../../src/server"
runner = require "../../../src/runner"
plugin = require "../../../src/plugin"

describe "plugin unit test", ->
  after ->
    delete require.cache[require.resolve "../../../src/runner"]
    delete require.cache[require.resolve "../../../src/server"]
  it "plugin should have server", ->
    expect(plugin.server).eql server
  it "plugin should have runner", ->
    expect(plugin.runner).eql runner
